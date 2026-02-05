
import { google, Auth } from 'googleapis'
import { GoogleConfig } from '@keeper/api/resources'
import { GoogleOauth } from './google-oauth.domain'

export class GoogleOauthClient {
  public constructor(
    protected readonly googleConfig: GoogleConfig
  ) {}

  protected resolveOauthServerClient(options?: Auth.OAuth2ClientOptions) {
    return new google.auth.OAuth2({ ...options,
      clientSecret: this.googleConfig.clientSecret,
      redirectUri: this.googleConfig.redirectUri,
      clientId: this.googleConfig.clientId,
    });
  }

  protected resolveOauthClient(credentials: { refreshToken: string }) {
    const userClient = this.resolveOauthServerClient()
    userClient.setCredentials({ refresh_token: credentials.refreshToken })
    return userClient
  }

  public async getOauthProfile(credentials: GoogleOauth.Metadata): Promise<GoogleOauth.ProfileMetadata> {
    const result = await google.oauth2("v2").userinfo.get({ auth: this.resolveOauthClient(credentials) });

    if(!result?.data?.id) {
      // TODO: Refresh_token might be undefined on subsequent logins.
      // TODO: Do not overwrite an existing refresh token if undefined.
      throw new Error('Could not obtain authorization profile. Provider returned empty/undefined source id.')
    }

    if(!result?.data?.email) {
      throw new Error('Could not obtain authorization profile. Provider returned empty/undefined email address.')
    }

    return {
      email: result.data.email,
      sourceId: result.data.id,
    }
  }

  public async getOauthMetadata(code: string): Promise<GoogleOauth.Metadata> {
    const result = await this.resolveOauthServerClient().getToken(code);

    if(!result?.tokens?.refresh_token) {
      throw new Error('Could not complete authorization token exchange. Provider returned empty/undefined refresh token.')
    }

    if(!result?.tokens?.expiry_date) {
      throw new Error('Could not complete oAuth authorization exchange. Provider returned empty/undefined token expiry date.')
    }

    return {
      refreshToken: result.tokens.refresh_token,
      refreshTokenExpiresAt: result.tokens.expiry_date,
      refreshTokenExchangedAt: Date.now(),
    }
  }
}