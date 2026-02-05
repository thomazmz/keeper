import { MongoClient } from 'mongodb'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { KeeperRecord } from './keeper-record.domain'

export class KeeperRecordRepository extends MongodbRepository<KeeperRecord> {
  private static readonly COLLECTION_NAME = 'keeper_record'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(KeeperRecordRepository.COLLECTION_NAME, KeeperRecordRepository.DATABASE_NAME, mongodbClient)

    this.collection.createIndex({ sourceId: 1}, { unique: true })
    this.collection.createIndex({ email: 1}, { unique: true })
  }

  protected map(document: MongodbDocument<KeeperRecord>): KeeperRecord {
    return {
      id: document._id.toHexString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      merchant: document.merchant,
      ownerId: document.ownerId,
      ammount: document.ammount,
      title: document.title,
    }
  }
}