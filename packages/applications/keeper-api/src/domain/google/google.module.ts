import { InjectionModule } from "@nodelith/injection";
import { GoogleOauthConfigInitializer } from "./google-oauth/google-oauth.config";
import { GoogleOauthRepository } from "./google-oauth/google-oauth.repository";
import { GoogleOauthService } from "./google-oauth/google-oauth.service";
import { GoogleOauthClient } from "./google-oauth/google-oauth.client";

export const GoogleModule = InjectionModule.create()
GoogleModule.mapClassInitializer('googleOauthConfigRecord', GoogleOauthConfigInitializer)
GoogleModule.mapClassRegistration('googleOauthClient', GoogleOauthClient)
GoogleModule.mapClassRegistration('googleOauthService', GoogleOauthService)
GoogleModule.mapClassRegistration('googleOauthRepository', GoogleOauthRepository)
