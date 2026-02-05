import { ExpressModule } from '@nodelith/express'
import { InfraModule } from './resources/mongodb.module'
import { DomainModule } from './domain/domain.module'
import { AuthController } from './api/oauth.controller'
import { PubsubController } from './api/pubsub.controller'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.useController(PubsubController)
ApplicationModule.useController(AuthController)
ApplicationModule.useModule(InfraModule)
ApplicationModule.useModule(DomainModule)