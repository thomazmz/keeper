import { MongoClient } from "mongodb"
import { MongodbRepository } from "@nodelith/mongodb"
import { MongodbDocument } from "@nodelith/mongodb"
import { GoogleInbox } from "./google-inbox.domain"

export class GoogleInboxRepository extends MongodbRepository<GoogleInbox> {
  private static readonly COLLECTION_NAME = 'google_inbox'
  private static readonly DATABASE_NAME = 'keeper_database'

  public constructor(mongodbClient: MongoClient) {
    super(GoogleInboxRepository.COLLECTION_NAME, GoogleInboxRepository.DATABASE_NAME, mongodbClient)
    this.collection.createIndex({ email: 1 }, { unique: true })
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