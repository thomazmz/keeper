import { GoogleOauth } from "./google-oauth.domain"

export namespace GoogleOauthRepository {
  export type FindOneParameters = {
    id?: GoogleOauth['id'],
    email?: GoogleOauth['email'],
    sourceId?: GoogleOauth['sourceId'],
  }

  export type CreateOneParameters = {
    email: GoogleOauth['email'],
    sourceId: GoogleOauth['sourceId'],
    refreshToken: GoogleOauth['refreshToken'],
    refreshTokenExpiresAt: GoogleOauth['refreshTokenExpiresAt'],
    refreshTokenExchangedAt: GoogleOauth['refreshTokenExchangedAt'],
  }

  export type UpdateOneParameters = {
    id: GoogleOauth['id'],
    refreshToken?: GoogleOauth['refreshToken'],
    refreshTokenExpiresAt?: GoogleOauth['refreshTokenExpiresAt'],
    refreshTokenExchangedAt?: GoogleOauth['refreshTokenExchangedAt'],
  }
}

export interface GoogleOauthRepository {
  findOne(filter: GoogleOauthRepository.FindOneParameters): Promise<GoogleOauth | undefined>

  createOne(properties: GoogleOauthRepository.CreateOneParameters): Promise<GoogleOauth>

  updateOne(properties: GoogleOauthRepository.UpdateOneParameters): Promise<GoogleOauth>
}
