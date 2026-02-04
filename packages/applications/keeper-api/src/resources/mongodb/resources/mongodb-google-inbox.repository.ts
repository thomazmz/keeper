import { MongoClient } from 'mongodb'
import { GoogleInbox } from '@keeper/domain'
import { MongodbDocument } from "@nodelith/mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { GoogleInboxRepository } from '@keeper/domain'

export class MongodbGoogleInboxRepository extends MongodbRepository<GoogleInbox> implements GoogleInboxRepository {
  private static readonly COLLECTION_NAME = 'google_inbox'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(MongodbGoogleInboxRepository.COLLECTION_NAME, MongodbGoogleInboxRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex('email', { unique: true })
  }

  protected map(document: MongodbDocument<GoogleInbox>): GoogleInbox {
    return {
      id: document._id.toHexString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      cursor: document.cursor,
      email: document.email,
    }
  }
}