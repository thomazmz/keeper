import { InjectionModule } from "@nodelith/injection";
import { MongodbClientInitializer } from "@nodelith/mongodb";
import { MongodbConfigInitializer } from "@nodelith/mongodb";
import { MongodbKeeperUserRepository } from "./mongodb/repositories/mongodb-keeper-user.repository";
import { MongodbGoogleOauthRepository } from "./mongodb/repositories/mongodb-google-oauth.repository";
import { MongodbGoogleInboxRepository } from "./mongodb/repositories/mongodb-google-inbox.repository";
import { MongodbKeeperEmailRepository } from "./mongodb/repositories/mongodb-keeper-email.repository";

export const InfraModule = InjectionModule.create()
InfraModule.mapClassInitializer('mongodbConfig', MongodbConfigInitializer)
InfraModule.mapClassInitializer('mongodbClient', MongodbClientInitializer)

InfraModule.mapClassRegistration('keeperEmailRepository', MongodbKeeperEmailRepository)
InfraModule.mapClassRegistration('googleInboxRepository', MongodbGoogleInboxRepository)
InfraModule.mapClassRegistration('googleOauthRepository', MongodbGoogleOauthRepository)
InfraModule.mapClassRegistration('keeperUserRepository', MongodbKeeperUserRepository)
