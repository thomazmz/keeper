import { InjectionModule } from "@nodelith/injection";
import { MongodbClientInitializer } from "@nodelith/mongodb";
import { MongodbConfigInitializer } from "@nodelith/mongodb";
import { MongodbKeeperUserRepository } from "./mongodb/resources/mongodb-keeper-user.repository";
import { MongodbGoogleOauthRepository } from "./mongodb/resources/mongodb-google-oauth.repository";
import { MongodbGoogleInboxRepository } from "./mongodb/resources/mongodb-google-inbox.repository";

export const InfraModule = InjectionModule.create()
InfraModule.mapClassInitializer('mongodbConfig', MongodbConfigInitializer)
InfraModule.mapClassInitializer('mongodbClient', MongodbClientInitializer)

InfraModule.mapClassRegistration('googleInboxRepository', MongodbGoogleInboxRepository)
InfraModule.mapClassRegistration('googleOauthRepository', MongodbGoogleOauthRepository)
InfraModule.mapClassRegistration('keeperUserRepository', MongodbKeeperUserRepository)