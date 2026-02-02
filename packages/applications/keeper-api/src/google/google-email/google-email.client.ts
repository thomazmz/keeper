import { google } from 'googleapis'

import { GoogleClient } from '../google-client'
import { GoogleOauth } from '../google-oauth/google-oauth.domain'

import { GoogleEmail } from './google-email.domain'
import { GoogleEmailConfig } from './google-email.config'

export class GoogleEmailClient extends GoogleClient {
  public constructor(googleEmailConfig: GoogleEmailConfig) {
    super(googleEmailConfig)
  }

  protected async resolveGmailClient(credentials: GoogleOauth.CredentialsMetadata) {
    return google.gmail({ auth: this.resolveOauthClient(credentials), version: 'v1' })
  }

  public async getLatestMessagesMetadata(credentials: GoogleOauth.CredentialsMetadata, inboxMetadata: GoogleEmail.InboxMetadata): Promise<GoogleEmail.MessageMetadata[]> {
    const client = await this.resolveGmailClient(credentials)

    const response = await client.users.history.list({
      startHistoryId: inboxMetadata.history,
      historyTypes: ["messageAdded"],
      userId: 'me',
    })

    console.log('response.data:', response.data)

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

    console.log('sourceIds:', sourceIds)

    return Promise.all(sourceIds.map((sourceId) => {
      return this.getEmailMessageMetadata(credentials, sourceId)
    }))
  }

  public async getEmailInboxMetadata(credentials: GoogleOauth.CredentialsMetadata): Promise<GoogleEmail.InboxMetadata> {
    const client = await this.resolveGmailClient(credentials)
    const response = await client.users.getProfile({
      userId: 'me'
    })

    if(!response?.data?.historyId) {
      throw new Error('Could not load gmail inbox metadata. Provider returned empty/undefined history id.')
    }

    if(!response?.data?.emailAddress) {
      throw new Error('Could not load gmail inbox metadata. Provider returned empty/undefined email address.')
    }

    return {
      history: response?.data?.historyId,
      address: response?.data?.emailAddress,
    }
  }

  public async getEmailMessageMetadata(credentials: GoogleOauth.CredentialsMetadata, sourceId: string): Promise<GoogleEmail.MessageMetadata> {
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

    return {
      date,
      sender,
      subject,
      sourceId,
      recipient,
    }
  }
}
