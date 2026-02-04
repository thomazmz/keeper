import { InjectionModule } from "@nodelith/injection"
import { GoogleConfigInitializer } from "./google.config"
import { GoogleOauthClient } from "./google-oauth/google-oauth.client"
import { GoogleInboxClient } from "./google-inbox/google-inbox.client"
import { GoogleOauthService } from "./google-oauth/google-oauth.service"
import { GoogleInboxService } from "./google-inbox/google-inbox.service"

export const GoogleModule = InjectionModule.create()
GoogleModule.mapClassInitializer('googleConfig', GoogleConfigInitializer)
GoogleModule.mapClassRegistration('googleOauthClient', GoogleOauthClient)
GoogleModule.mapClassRegistration('googleInboxClient', GoogleInboxClient)
GoogleModule.mapClassRegistration('googleOauthService', GoogleOauthService)
GoogleModule.mapClassRegistration('googleInboxService', GoogleInboxService)
