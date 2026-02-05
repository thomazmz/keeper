import { MongoClient } from 'mongodb'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { KeeperUser } from './keeper-user.domain'

export class KeeperUserRepository extends MongodbRepository<KeeperUser> {
  private static readonly COLLECTION_NAME = 'keeper_user'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(KeeperUserRepository.COLLECTION_NAME, KeeperUserRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex({ email: 1}, { unique: true })
  }

  protected map(document: MongodbDocument<KeeperUser>): KeeperUser {
    return {
      id: document._id.toHexString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      email: document.email,
    }
  }
}