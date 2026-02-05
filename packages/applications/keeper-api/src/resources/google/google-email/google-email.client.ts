import { Auth } from "googleapis"
import { google } from "googleapis"
import { simpleParser } from "mailparser"
import { GoogleOauth } from "@keeper/api/resources";
import { GoogleEmail } from "@keeper/api/resources"
import { GoogleConfig } from "@keeper/api/resources"

export class GoogleEmailClient {
  public constructor(
    protected readonly googleConfig: GoogleConfig
  ) {}

  protected resolveOauthServerClient(options?: Auth.OAuth2ClientOptions) {
    return new google.auth.OAuth2({ ...options,
      clientSecret: this.googleConfig.clientSecret,
      clientId: this.googleConfig.clientId,
    })
  }

  protected resolveOauthClient(credentials: { refreshToken: string }) {
    const userClient = this.resolveOauthServerClient()
    userClient.setCredentials({ refresh_token: credentials.refreshToken })
    return userClient
  }

  protected async resolveGmailClient(credentials: GoogleOauth.Metadata) {
    return google.gmail({ auth: this.resolveOauthClient(credentials), version: 'v1' })
  }

  public async getEmailIds(credentials: GoogleOauth.Metadata, historyId: string): Promise<string[]> {
    const client = await this.resolveGmailClient(credentials)

    const response = await client.users.history.list({
      startHistoryId: historyId,
      historyTypes: ["messageAdded"],
      userId: 'me',
    })

    return (response.data.history ?? [])
      .flatMap((historyItem) => {
        return historyItem.messagesAdded ?? []
      })
      .filter(historyItem => {
        return !!historyItem.message?.id
      })
      .map((historyItem) => {
        return historyItem.message?.id
      }) as string[]
  }

  public async getEmailHeader(credentials: GoogleOauth.Metadata, sourceId: string): Promise<GoogleEmail.Header> {
    const client = await this.resolveGmailClient(credentials)
    const response = await client.users.messages.get({
      metadataHeaders: ['from', 'subject', 'date', 'to'],
      format: 'metadata',
      id: sourceId,
      userId: 'me',
    })

    const sender = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'from').map(header => header.value)?.[0]

    if(!sender) {
      throw new Error(`Could not load metadata for message id ${sourceId}. Provider returned empty/undefined sender.`)
    }

    const timestamp = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'date').map(header => header.value)?.[0]
    
    if(!timestamp) {
      throw new Error(`Could not load metadata for message id ${sourceId}. Provider returned empty/undefined timestamp.`)
    }

    const recipient = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'to').map(header => header.value)?.[0]
    
    if(!recipient) {
      throw new Error(`Could not load metadata for message id ${sourceId}. Provider returned empty/undefined recipient.`)
    }

    const subject = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'subject').map(header => header.value)?.[0]
    
    if(!subject) {
      throw new Error(`Could not load metadata for message id ${sourceId}. Provider returned empty/undefined subject.`)
    }

    const date = new Date(timestamp)

    return {
      recipient,
      sourceId,
      subject,
      sender,
      date,
    }
  }

  public async getEmailContent(credentials: GoogleOauth.Metadata, sourceId: string): Promise<GoogleEmail.Content> {
    const client = await this.resolveGmailClient(credentials)
    const response = await client.users.messages.get({
      userId: "me",
      id: sourceId,
      format: "raw",
    })

    if(!response?.data?.raw) {
      throw new Error(`Could not load content for message id ${sourceId}. Provider returned empty/undefined vale.`)
    }

    const content = await this.parseContent(response.data.raw, sourceId)

    if(!content) {
      throw new Error(`Could not load content for message id ${sourceId}. Provider returned empty/undefined vale.`)
    }

    return content
  }

  private async parseContent(base64: string, sourceId: string) {
    const parsed = await simpleParser(this.base64UrlToBuffer(base64));

    if(parsed.text) return {
      sourceId,
      data: this.normalizeText(parsed.text),
      type: 'text/plain' as const,
    }

    if(parsed.html) return {
      sourceId,
      data: this.normalizeHtml(parsed.html),
      type: 'text/html' as const,
    }

    return
  }

  private normalizeText(text: string) {
    return text
      // Convert non-breaking spaces (often used in emails) into normal spaces
      // so spacing behaves consistently in comparisons/regex.
      .replace(/\u00A0/g, " ")
      // Remove invisible “zero-width” characters that can break matching and indexing
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Normalize Windows CRLF line endings to LF for stable parsing.
      .replace(/\r\n/g, "\n")
      // Collapse runs of spaces/tabs to a single space to reduce noise for regex.
      .replace(/[ \t]+/g, " ")
      // Collapse excessive blank lines while keeping paragraph separation.
      .replace(/\n{3,}/g, "\n\n")
      // Remove leading/trailing whitespace for consistent storage/matching.
      .trim();
  }
  
  private normalizeHtml(html: string): string {
    return html
      // Normalize all line endings to LF so storage/diffs are stable across platforms.
      .replace(/\r\n/g, "\n")
      // Convert lone CR to LF (some clients produce CR-only content).
      .replace(/\r/g, "\n")
      // Convert non-breaking spaces into normal spaces. Keeps layout mostly intact
      // while avoiding weird spacing issues in downstream processing.
      .replace(/\u00A0/g, " ")
      // Remove invisible “zero-width” characters that can cause subtle DOM/query mismatches.
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      // Normalize Unicode line/paragraph separators into LF so they behave like newlines.
      .replace(/\u2028|\u2029/g, "\n")
      // Trim outer whitespace; avoid collapsing internal whitespace to preserve HTML layout.
      .trim();
  }

  private base64UrlToBuffer(base64: string): Buffer {
    const b64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    return Buffer.from(b64 + pad, "base64");
  }
}
