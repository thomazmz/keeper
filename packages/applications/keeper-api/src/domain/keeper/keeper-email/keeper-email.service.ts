import { CoreEntity, CoreIssue, CoreParser } from '@nodelith/core'
import { KeeperEmailRepository } from './keeper-email.repository'
import { GoogleOauthService } from '@keeper/domain'
import { GoogleEmailClient } from '@keeper/domain'
import { KeeperEmail } from '@keeper/domain'
import { simpleParser } from 'mailparser'

export class KeeperEmailService {
  public constructor(
    private readonly googleEmailClient: GoogleEmailClient,
    private readonly googleOauthService: GoogleOauthService,
    private readonly keeperEmailRepository: KeeperEmailRepository
  ) {}

  public async ingestSourcedEmailEntries(entries: KeeperEmail.MessageMetadata[]): Promise<void> {
    await Promise.all(entries.map((entry) => this.ingestSourcedEmailEntry(entry)))
  }

  public async ingestSourcedEmailEntry(entry: KeeperEmail.MessageMetadata): Promise<void> {
    if(entry.subject !== 'Authorization without credit card present') {
      return
    }

    const oauth = await this.googleOauthService.getGoogleOauthByEmail(entry.recipient)

    const content = await this.googleEmailClient.getEmailMessageContent(oauth, entry.sourceId)

    const result = await parseContent(content)

    // TODO: THIS NEEDS OBSERVABILITY
    if(!result.success) {
      return
    }

    this.saveSourcedEmailEntry({
      ...result.value,
      ...entry,
    })
  }

  private async saveSourcedEmailEntry(entries: CoreEntity.Entries<KeeperEmail>) {
    const { source, sourceId, ...properties } = entries

    const sourcedEmail = await this.findSourcedEmail({ source, sourceId })

    if(!sourcedEmail) return this.createSourcedEmail({ ...properties,
      sourceId,
      source,
    })

    return this.keeperEmailRepository.updateOneById(sourcedEmail.id, properties)
  }

  private createSourcedEmail(properties: CoreEntity.Entries<KeeperEmail>): Promise<KeeperEmail> {
    return this.keeperEmailRepository.createOne(properties)
  }

  private findSourcedEmail(properties: { sourceId: string, source: string }): Promise<KeeperEmail| undefined> {
    return this.keeperEmailRepository.findOneByQuery(properties)
  }
}

function base64UrlToBuffer(base64: string): Buffer {
  const b64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, "base64");
}

function normalizeText(text: string) {
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

export function normalizeHtml(html: string): string {
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

export async function parseContent(base64: string): Promise<CoreParser.Result<KeeperEmail.ContentWrapper>> {
  const parsed = await simpleParser(base64UrlToBuffer(base64));

  if(parsed.text) return { success: true, value: {
    data: normalizeText(parsed.text),
    type: 'text/plain',
  }}

  if(parsed.html) return { success: true, value: {
    data: normalizeHtml(parsed.html),
    type: 'text/html',
  }}

  return { success: false,
    issues: [ CoreIssue.create('Failed to parse base 64 content into text/html.') ]
  }
}
