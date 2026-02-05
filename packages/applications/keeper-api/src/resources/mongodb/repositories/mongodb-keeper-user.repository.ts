import { MongoClient } from 'mongodb'
import { KeeperUser } from 'domain/domain.library'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { KeeperUserRepository } from "domain/domain.library"

export class MongodbKeeperUserRepository extends MongodbRepository<KeeperUser> implements KeeperUserRepository {
  private static readonly COLLECTION_NAME = 'keeper_user'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(MongodbKeeperUserRepository.COLLECTION_NAME, MongodbKeeperUserRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex({ email: 1 }, { unique: true })
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