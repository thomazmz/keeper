import { Auth } from "googleapis"
import { google } from "googleapis"
import { GoogleOauth } from "@keeper/api/resources"
import { GoogleInbox } from "@keeper/api/resources"
import { GoogleConfig } from "@keeper/api/resources"

export class GoogleInboxClient {
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

  public async getInboxMetadata(credentials: GoogleOauth.Metadata): Promise<GoogleInbox.Metadata> {
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
      cursor: response?.data?.historyId,
      email: response?.data?.emailAddress,
    }
  }
}
