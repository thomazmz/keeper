

import { google, Auth } from 'googleapis'
import { GoogleInbox } from '@keeper/domain'
import { GoogleOauth } from '@keeper/domain'
import { KeeperEmail } from '@keeper/domain'
import { GoogleConfig } from '@keeper/domain'

export class GoogleEmailClient {
  private static EMAIL_SOURCE = 'google-api'

  public constructor(private readonly googleConfig: GoogleConfig) { }

  protected resolveOauthServerClient(options?: Auth.OAuth2ClientOptions) {
    return new google.auth.OAuth2({ ...options,
      clientSecret: this.googleConfig.clientSecret,
      clientId: this.googleConfig.clientId,
    });
  }

  protected resolveOauthClient(credentials: { refreshToken: string }) {
    const userClient = this.resolveOauthServerClient()
    userClient.setCredentials({ refresh_token: credentials.refreshToken })
    return userClient
  }

  protected async resolveGmailClient(credentials: GoogleOauth.CredentialsMetadata) {
    return google.gmail({ auth: this.resolveOauthClient(credentials), version: 'v1' })
  }


  public async getMessagesMetadata(credentials: GoogleOauth.CredentialsMetadata, inbox: GoogleInbox.Metadata): Promise<KeeperEmail.MessageMetadata[]> {
    const client = await this.resolveGmailClient(credentials)

    const response = await client.users.history.list({
      startHistoryId: inbox.cursor,
      historyTypes: ["messageAdded"],
      userId: 'me',
    })

    const sourceIds = (response.data.history ?? [])
      .flatMap((historyItem) => {
        return historyItem.messagesAdded ?? []
      })
      .filter(historyItem => {
        return !!historyItem.message?.id
      })
      .map((historyItem) => {
        return historyItem.message?.id
      }) as string[]

    const settledResults = await Promise.allSettled(sourceIds.map((sourceId) => {
      return this.getEmailMessageMetadata(credentials, sourceId)
    }))

    const fulfilledResults = settledResults
      .filter((result) => result.status === 'fulfilled')
      .map(result => result.value)

    // TODO: How to handle rejected results?
    // const rejectedResults = settledResults
    //   .filter((result) => result.status === 'rejected')
    //   .map(result => result.reason)

     return fulfilledResults
  }

  private async getEmailMessageMetadata(credentials: GoogleOauth.CredentialsMetadata, sourceId: string): Promise<KeeperEmail.MessageMetadata> {
    const client = await this.resolveGmailClient(credentials)
    const response = await client.users.messages.get({
      metadataHeaders: ['from', 'subject', 'date', 'to'],
      format: 'metadata',
      id: sourceId,
      userId: 'me',
    })

    const sender = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'from').map(header => header.value)?.[0]

    if(!sender) {
      throw new Error(`Could not load gmail metadata for message id ${sourceId}. Provider returned empty/undefined sender.`)
    }

    const timestamp = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'date').map(header => header.value)?.[0]
    
    if(!timestamp) {
      throw new Error(`Could not load gmail metadata for message id ${sourceId}. Provider returned empty/undefined timestamp.`)
    }

    const recipient = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'to').map(header => header.value)?.[0]
    
    if(!recipient) {
      throw new Error(`Could not load gmail metadata for message id ${sourceId}. Provider returned empty/undefined recipient.`)
    }

    const subject = response?.data?.payload?.headers?.filter(header => header.name?.toLocaleLowerCase() === 'subject').map(header => header.value)?.[0]
    
    if(!subject) {
      throw new Error(`Could not load gmail metadata for message id ${sourceId}. Provider returned empty/undefined subject.`)
    }

    const date = new Date(timestamp)

    return { source: GoogleEmailClient.EMAIL_SOURCE,
      recipient,
      sourceId,
      subject,
      sender,
      date,
    }
  }

  public async getEmailMessageContent(credentials: GoogleOauth.CredentialsMetadata, sourceId: string): Promise<string> {
    const client = await this.resolveGmailClient(credentials)
    const response = await client.users.messages.get({
      userId: "me",
      id: sourceId,
      format: "raw",
    })

    if(!response?.data?.raw) {
      throw new Error(`Could not load content for message id ${sourceId}. Provider returned empty/undefined vale.`)
    }

    return response.data.raw
  }

}
