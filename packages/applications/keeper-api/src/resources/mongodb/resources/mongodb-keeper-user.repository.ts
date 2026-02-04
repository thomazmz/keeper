import { MongoClient } from 'mongodb'
import { KeeperUser } from 'domain/domain.library'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { KeeperUserRepository } from "domain/domain.library"

export class MongodbKeeperUserRepository extends MongodbRepository<KeeperUser> implements KeeperUserRepository {
  public constructor(mongodbClient: MongoClient) {
    super('keeper_user', 'keeper_database', mongodbClient)
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