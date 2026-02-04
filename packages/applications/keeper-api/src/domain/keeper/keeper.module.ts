import { InjectionModule } from "@nodelith/injection";
import { KeeperOauthService } from "./oauth/keeper-oauth.service";

export const KeeperModule = InjectionModule.create()
KeeperModule.mapClassRegistration('keeperOauthService', KeeperOauthService)
