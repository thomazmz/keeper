import { InjectionModule } from "@nodelith/injection"
import { GoogleOauthClient } from "./google-oauth/google-oauth.client"
import { GoogleOauthService } from "./google-oauth/google-oauth.service"
import { GoogleOauthConfigInitializer } from "./google-oauth/google-oauth.config"

export const GoogleModule = InjectionModule.create()
GoogleModule.mapClassInitializer('googleOauthConfigRecord', GoogleOauthConfigInitializer)
GoogleModule.mapClassRegistration('googleOauthClient', GoogleOauthClient)
GoogleModule.mapClassRegistration('googleOauthService', GoogleOauthService)
