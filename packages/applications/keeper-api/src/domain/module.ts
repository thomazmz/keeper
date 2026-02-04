import { InjectionModule } from "@nodelith/injection";
import { GoogleModule } from "./google/google.module";
import { OauthModule } from "./oauth/oauth.module";

export const DomainModule = InjectionModule.create() 
DomainModule.useModule(GoogleModule)
DomainModule.useModule(OauthModule)