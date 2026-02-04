import { ConfigInitializer } from "@nodelith/config"
import { ConfigProfile } from "@nodelith/config"

export type GoogleOauthConfigRecord = {
  readonly redirectUri: string
  readonly clientId: string
  readonly clientSecret: string
}

export class GoogleOauthConfigInitializer extends ConfigInitializer<GoogleOauthConfigRecord> {
  public readonly profile: ConfigProfile<GoogleOauthConfigRecord> = Object.freeze({
    clientId: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectUri: ConfigProfile.string('GOOGLE_OAUTH_REDIRECT_URL'),
  })
}
