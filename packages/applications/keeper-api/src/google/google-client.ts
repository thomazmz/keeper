import { google, Auth } from 'googleapis';

import { GoogleConfig } from './google-config';

export abstract class GoogleClient {
  protected readonly clientId: string

  protected readonly clientSecret: string

  protected constructor(googleConfig: GoogleConfig) {
    this.clientId = googleConfig.clientId
    this.clientSecret = googleConfig.clientSecret
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
