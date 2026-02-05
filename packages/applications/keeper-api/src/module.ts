import { ExpressModule } from '@nodelith/express'
import { DomainModule } from './domain/domain.module'
import { ResourcesModule } from './resources/resources.module'
import { AuthController } from './api/oauth.controller'
import { PubsubController } from './api/pubsub.controller'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.useController(PubsubController)
ApplicationModule.useController(AuthController)
ApplicationModule.useModule(ResourcesModule)
ApplicationModule.useModule(DomainModule)