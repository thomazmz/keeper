import { ExpressModule } from '@nodelith/express'
import { ResourcesModule } from '@keeper/api/resources'
import { MongodbConfigInitializer } from "@nodelith/mongodb"
import { MongodbClientInitializer } from "@nodelith/mongodb"
import { KeeperRecordController } from './routes/record.controller'
import { KeeperAuthController } from './routes/oauth.controller'
import { PubsubController } from './routes/pubsub.controller'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.mapClassInitializer('mongodbConfig', MongodbConfigInitializer)
ApplicationModule.mapClassInitializer('mongodbClient', MongodbClientInitializer)
ApplicationModule.useController(KeeperRecordController)
ApplicationModule.useController(KeeperAuthController)
ApplicationModule.useController(PubsubController)
ApplicationModule.useModule(ResourcesModule)
