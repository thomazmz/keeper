import { MongoClient } from 'mongodb'
import { GoogleOauth } from 'domain/domain.library'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { GoogleOauthRepository } from "domain/domain.library"

export class MongodbGoogleOauthRepository extends MongodbRepository<GoogleOauth> implements GoogleOauthRepository {
  public constructor(mongodbClient: MongoClient) {
    super('google_oauth', 'keeper_database', mongodbClient)
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