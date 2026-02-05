import { InjectionModule } from "@nodelith/injection";
import { MongodbClientInitializer } from "@nodelith/mongodb";
import { MongodbConfigInitializer } from "@nodelith/mongodb";
import { MongodbKeeperUserRepository } from "./mongodb/repositories/mongodb-keeper-user.repository";
import { MongodbGoogleOauthRepository } from "./mongodb/repositories/mongodb-google-oauth.repository";
import { MongodbGoogleInboxRepository } from "./mongodb/repositories/mongodb-google-inbox.repository";
import { MongodbKeeperEmailRepository } from "./mongodb/repositories/mongodb-keeper-email.repository";

export const ResourcesModule = InjectionModule.create()
ResourcesModule.mapClassInitializer('mongodbConfig', MongodbConfigInitializer)
ResourcesModule.mapClassInitializer('mongodbClient', MongodbClientInitializer)

ResourcesModule.mapClassRegistration('keeperUserRepository', MongodbKeeperUserRepository)
ResourcesModule.mapClassRegistration('keeperEmailRepository', MongodbKeeperEmailRepository)
ResourcesModule.mapClassRegistration('googleInboxRepository', MongodbGoogleInboxRepository)
ResourcesModule.mapClassRegistration('googleOauthRepository', MongodbGoogleOauthRepository)
