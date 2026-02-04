import { ExpressModule } from '@nodelith/express'

import { OauthController } from './routes/oauth.controller'
import { DomainModule } from './domain/library'

export const ApplicationModule = ExpressModule.create()
ApplicationModule.useController(OauthController)
ApplicationModule.useModule(DomainModule)
