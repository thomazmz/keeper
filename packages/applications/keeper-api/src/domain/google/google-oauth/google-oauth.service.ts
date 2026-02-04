import { GoogleOauthClient } from "./google-oauth.client";
import { GoogleOauth } from "./google-oauth.domain";
import { GoogleOauthRepository } from "./google-oauth.repository";

export class GoogleOauthService {
  private googleOauthClient: GoogleOauthClient
  private googleOauthRepository: GoogleOauthRepository

  public constructor(
    googleOauthClient: GoogleOauthClient,
    googleOauthRepository: GoogleOauthRepository,
  ) {
    this.googleOauthClient = googleOauthClient
    this.googleOauthRepository = googleOauthRepository
  }

  public async upsertOauthCredentials(code: string): Promise<GoogleOauth> {
    const credentials = await this.googleOauthClient.getOauthCredentials(code)

    const profile = await this.googleOauthClient.getOauthProfile(credentials)

    const oauth = await this.googleOauthRepository.findOne({
      sourceId: profile.sourceId,
      email: profile.email,
    })

    if(!oauth) {
      return this.googleOauthRepository.createOne({
        email: profile.email,
        sourceId: profile.sourceId,
        refreshToken: credentials.refreshToken,
        refreshTokenExpiresAt: credentials.refreshTokenExpiresAt,
        refreshTokenExchangedAt: credentials.refreshTokenExchangedAt
      })
    }

    return this.googleOauthRepository.updateOne({
      id: oauth.id,
      refreshToken: credentials.refreshToken,
      refreshTokenExpiresAt: credentials.refreshTokenExpiresAt,
      refreshTokenExchangedAt: credentials.refreshTokenExchangedAt
    })
  }
}

