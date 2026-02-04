
import { ConfigInitializer } from '@nodelith/config';
import { ConfigProfile } from '@nodelith/config';

export type GoogleConfigRecord = {
  readonly clientId: string
  readonly clientSecret: string
  readonly redirectUri: string
}

export class GoogleConfigInitializer extends ConfigInitializer<GoogleConfigRecord> {
  public readonly profile: ConfigProfile<GoogleConfigRecord> = Object.freeze({
    clientId: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: ConfigProfile.string('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectUri: ConfigProfile.string('GOOGLE_OAUTH_REDIRECT_URL'),
  })
}
