import { ConfigInitializer } from '@nodelith/config';
import { ConfigProfile } from '@nodelith/config';

export type GoogleConfig = {
  readonly clientId: string
  readonly clientSecret: string
  readonly redirectUri: string
}

export class GoogleConfigInitializer extends ConfigInitializer<GoogleConfig> {
  public readonly profile: ConfigProfile<GoogleConfig> = Object.freeze({
    clientId: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectUri: ConfigProfile.string('GOOGLE_OAUTH_REDIRECT_URL'),
  })
}
