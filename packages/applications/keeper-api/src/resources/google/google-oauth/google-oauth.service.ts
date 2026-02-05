import { HttpBadRequestError } from "@nodelith/http";

import { GoogleOauth } from "./google-oauth.domain";
import { GoogleOauthClient } from "./google-oauth.client";
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

  public async getOauth(email: string): Promise<GoogleOauth> {
    const oauth = await this.googleOauthRepository.findOneByQuery({ email })
    if(!oauth) HttpBadRequestError.throw(`Could not find GoogleOauth entity for email ${email}`)
    return oauth
  }

  public async upsertOauth(code: string): Promise<GoogleOauth> {
    const metadata = await this.googleOauthClient.getOauthMetadata(code)

    const profile = await this.googleOauthClient.getOauthProfile(metadata)

    const oauth = await this.googleOauthRepository.findOneByQuery({
      sourceId: profile.sourceId,
      email: profile.email,
    })

    if(!oauth) {
      return this.googleOauthRepository.createOne({
        email: profile.email,
        sourceId: profile.sourceId,
        refreshToken: metadata.refreshToken,
        refreshTokenExpiresAt: metadata.refreshTokenExpiresAt,
        refreshTokenExchangedAt: metadata.refreshTokenExchangedAt
      })
    }

    const updatedRecord = await this.googleOauthRepository.updateOneById(oauth.id, {
      refreshToken: metadata.refreshToken,
      refreshTokenExpiresAt: metadata.refreshTokenExpiresAt,
      refreshTokenExchangedAt: metadata.refreshTokenExchangedAt
    })

    return updatedRecord ?? HttpBadRequestError.throw(
      `Could not finish upsert operation on GoogleOauth entity with id ${oauth.id}`
    )
  }
}

