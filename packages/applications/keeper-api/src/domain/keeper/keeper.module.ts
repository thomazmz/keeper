import { KeeperListenerService } from "./keeper-listener/keeper-listener.service";
import { KeeperUserService } from "./keeper-user/keeper-user.service";
import { KeeperAuthService } from "./keeper-auth/keeper-auth.service";
import { KeeperJwtService } from "./keeper-jwt/keeper-jwt.service";
import { KeeperJwtConfig } from "./keeper-jwt/keeper-jwt.config";
import { InjectionModule } from "@nodelith/injection";

export const KeeperModule = InjectionModule.create()
KeeperModule.mapClassRegistration('keeperListenerService', KeeperListenerService)
KeeperModule.mapClassRegistration('keeperUserService', KeeperUserService)
KeeperModule.mapClassRegistration('keeperAuthService', KeeperAuthService)
KeeperModule.mapClassRegistration('keeperJwtService', KeeperJwtService)
KeeperModule.mapClassInitializer('keeperJwtConfig', KeeperJwtConfig)