
import { google, Auth } from 'googleapis'

import { GoogleOauth } from './google-oauth.domain'
import { GoogleOauthConfigRecord } from './google-oauth.config'

export abstract class GoogleClient {
  protected readonly clientId: string

  protected readonly clientSecret: string

  protected constructor(googleOauthConfigRecord: GoogleOauthConfigRecord) {
    this.clientId = googleOauthConfigRecord.clientId
    this.clientSecret = googleOauthConfigRecord.clientSecret
  }

  protected resolveOauthServerClient(options?: Auth.OAuth2ClientOptions) {
    return new google.auth.OAuth2({ ...options,
      clientSecret: this.clientSecret,
      clientId: this.clientId,
    });
  }

  protected resolveOauthClient(credentials: { refreshToken: string }) {
    const userClient = this.resolveOauthServerClient()
    userClient.setCredentials({ refresh_token: credentials.refreshToken })
    return userClient
  }
}

export class GoogleOauthClient extends GoogleClient {
  protected readonly redirectUri: string;

  public constructor(googleOauthConfigRecord: GoogleOauthConfigRecord) {
    super(googleOauthConfigRecord)
    this.redirectUri = googleOauthConfigRecord.redirectUri
  }

  protected override resolveOauthServerClient(options?: Auth.OAuth2ClientOptions) {
    return super.resolveOauthServerClient({ ...options,
      redirectUri: this.redirectUri
    })
  }

  public async getOauthProfile(credentials: GoogleOauth.CredentialsMetadata): Promise<GoogleOauth.ProfileMetadata> {
    const result = await google.oauth2("v2").userinfo.get({ auth: this.resolveOauthClient(credentials) });

    if(!result?.data?.id) {
      // TODO: Refresh_token might be undefined on subsequent logins. 
      //////// Do not overwrite an existing refresh token if undefined.
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

  public async getOauthCredentials(code: string): Promise<GoogleOauth.CredentialsMetadata> {
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