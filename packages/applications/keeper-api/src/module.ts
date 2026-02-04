import { ExpressModule } from '@nodelith/express'

import { AuthController } from './routes/oauth.controller'
import { DomainModule } from './domain/library'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.useController(AuthController)
ApplicationModule.useModule(DomainModule)
