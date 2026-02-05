import { MongoClient } from 'mongodb'
import { KeeperEmail } from 'domain/domain.library'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { KeeperEmailRepository } from "domain/domain.library"

export class MongodbKeeperEmailRepository extends MongodbRepository<KeeperEmail> implements KeeperEmailRepository {
  private static readonly COLLECTION_NAME = 'keeper_email'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(MongodbKeeperEmailRepository.COLLECTION_NAME, MongodbKeeperEmailRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex({ source: 1, sourceId: 1 }, { unique: true })
  }

  protected map(document: MongodbDocument<KeeperEmail>): KeeperEmail {
    return {
      id: document._id.toHexString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      data: document.data,
      type: document.type,
      date: document.date,
      source: document.source,
      sender: document.sender,
      subject: document.subject,
      sourceId: document.sourceId,
      recipient: document.recipient,
    }
  }
}