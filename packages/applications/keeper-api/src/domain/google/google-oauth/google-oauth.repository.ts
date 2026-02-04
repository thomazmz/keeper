import { randomUUID } from "crypto"
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

export class GoogleOauthRepository implements GoogleOauthRepository {
  private records: GoogleOauth[] = []

  async findAll(): Promise<GoogleOauth[]> {
    return Promise.resolve(this.records)
  }

  async findOne(filter: GoogleOauthRepository.FindOneParameters): Promise<GoogleOauth | undefined> {
    return Promise.resolve(this.records.find((record) => (false
      || record.id === filter.id
      || record.email === filter.email
      || record.sourceId === filter.sourceId
    )))
  }

  async createOne(properties: GoogleOauthRepository.CreateOneParameters): Promise<GoogleOauth> {
    const oauth: GoogleOauth = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAd: new Date(),
      email: properties.email,
      sourceId: properties.sourceId,
      refreshToken: properties.refreshToken,
      refreshTokenExpiresAt: properties.refreshTokenExpiresAt,
      refreshTokenExchangedAt: properties.refreshTokenExchangedAt,
    }

    this.records.push(oauth)
    return Promise.resolve(oauth)
  }
  async updateOne(properties: GoogleOauthRepository.UpdateOneParameters): Promise<GoogleOauth> {
    const record = await this.findOne({ id: properties.id })

    if(!record) throw new Error('Oauth record not found.')

    const refreshToken = record.refreshToken
    const refreshTokenExpiresAt = record.refreshTokenExpiresAt
    const refreshTokenExchangedAt = record.refreshTokenExchangedAt

    const muttable: any = record

    muttable.refreshToken = properties.refreshToken ?? refreshToken
    muttable.refreshTokenExpiresAt = properties.refreshTokenExpiresAt ?? refreshTokenExpiresAt
    muttable.refreshTokenExchangedAt = properties.refreshTokenExchangedAt ?? refreshTokenExchangedAt

    return record
  }
}


// export interface GoogleOauthRepository {
//   findOne(filter: GoogleOauthRepository.FindOneParameters): Promise<GoogleOauth | undefined>

//   createOne(properties: GoogleOauthRepository.CreateOneParameters): Promise<GoogleOauth>

//   updateOne(properties: GoogleOauthRepository.UpdateOneParameters): Promise<GoogleOauth>
// }
