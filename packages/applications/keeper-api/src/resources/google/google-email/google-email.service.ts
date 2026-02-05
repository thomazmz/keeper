import { GoogleEmail, GoogleOauth } from '@keeper/api/resources'
import { GoogleOauthService } from '@keeper/api/resources'
import { GoogleInboxService } from '@keeper/api/resources'
import { GoogleEmailClient } from '@keeper/api/resources'

export class GoogleEmailService {
  public constructor(
    private readonly googleEmailClient: GoogleEmailClient,
    private readonly googleOauthService: GoogleOauthService,
    private readonly googleInboxService: GoogleInboxService,
  ) {}

  // private resolveFilters(headers: GoogleEmail.Header[], filter?: GoogleEmail.Filter): string[] {
  //   return headers
  //     .filter((header) => filter?.sender ? header.sender === header.sender : true)
  //     .filter((header) => filter?.subject ? header.subject === header.subject : true )
  //     .map((header) => header.sourceId)
  // }

  public async fetchGoogleEmails(email: string, cursor: string): Promise<GoogleEmail[]> {
    const oauth = await this.googleOauthService.getOauth(email)
    const inbox = await this.googleInboxService.getInbox(email)
    
    const ids = await this.googleEmailClient.getEmailIds(oauth, inbox.cursor)

    const headers = await this.fetchEmailHeaders(oauth, ids)

    const contents = await this.fetchEmailContents(oauth, ids)

    await this.googleInboxService.updateInbox(email, cursor)

    return ids
      .filter((id) => (!!headers[id] && !!contents[id]))
      .map((id) => ({ ...headers[id]!, ...contents[id]! }))
  }

  private async fetchEmailHeaders(oauth: GoogleOauth, ids: string[]) {
    const settledHeaders = await Promise.allSettled(ids.map((id) => {
      return this.googleEmailClient.getEmailHeader(oauth, id)
    }))

    // TODO: missing observability on API failures
    const rejectedHeaderObjects = settledHeaders
      .filter((result) => result.status === 'rejected')
      .map(result => result.reason)

    const fulfilledHeaderObjects = settledHeaders
      .filter((result) => result.status === 'fulfilled')
      .map(result => result.value)

    return fulfilledHeaderObjects.reduce((acc, header) => {
      return { ...acc, [header.sourceId] : header }
    }, {} as Record<string, GoogleEmail.Header>)
  }

  private async fetchEmailContents(oauth: GoogleOauth, ids: string[]) {
    const setledContents = await Promise.allSettled(ids.map((id) => {
      return this.googleEmailClient.getEmailContent(oauth, id)
    }))

    // TODO: missing observability on API failures
    const rejectedContentObjects = setledContents
      .filter((result) => result.status === 'rejected')
      .map(result => result.reason)

    const fulfilledContentObjects = setledContents
      .filter((result) => result.status === 'fulfilled')
      .map(result => result.value)

    return fulfilledContentObjects.reduce((acc, header) => {
      return { ...acc, [header.sourceId] : header }
    }, {} as Record<string, GoogleEmail.Content>)
  }
}
