import { ExpressModule } from '@nodelith/express'

import { DomainModule } from './domain/domain.module'
import { AuthController } from './routes/oauth.controller'
import { InfraModule } from './resources/mongodb.module'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.useController(AuthController)
ApplicationModule.useModule(InfraModule)
ApplicationModule.useModule(DomainModule)