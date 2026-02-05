import { MongoClient } from 'mongodb'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { GoogleOauth } from './google-oauth.domain'

export class GoogleOauthRepository extends MongodbRepository<GoogleOauth> {
  private static readonly COLLECTION_NAME = 'google_oauth'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(GoogleOauthRepository.COLLECTION_NAME, GoogleOauthRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex({ sourceId: 1}, { unique: true })
    this.collection.createIndex({ email: 1}, { unique: true })
  }

  protected map(document: MongodbDocument<GoogleOauth>): GoogleOauth {
    return {
      id: document._id.toHexString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      email: document.email,
      sourceId: document.sourceId,
      refreshToken: document.refreshToken,
      refreshTokenExpiresAt: document.refreshTokenExpiresAt,
      refreshTokenExchangedAt: document.refreshTokenExchangedAt,
    }
  }
}
