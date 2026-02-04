import { InjectionModule } from "@nodelith/injection";
import { OauthService } from "./oauth.service";

export const OauthModule = InjectionModule.create()
OauthModule.mapClassRegistration('oauthService', OauthService)
