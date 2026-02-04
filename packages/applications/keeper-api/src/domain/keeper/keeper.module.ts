import { InjectionModule } from "@nodelith/injection";
import { KeeperJwtConfig } from "./keeper-jwt/keeper-jwt.config";
import { KeeperJwtService } from "./keeper-jwt/keeper-jwt.service";
import { KeeperAuthService } from "./keeper-auth/keeper-auth.service";
import { KeeperUserService } from "./keeper-user/keeper-user.service";

export const KeeperModule = InjectionModule.create()
KeeperModule.mapClassRegistration('keeperUserService', KeeperUserService)
KeeperModule.mapClassRegistration('keeperAuthService', KeeperAuthService)
KeeperModule.mapClassRegistration('keeperJwtService', KeeperJwtService)
KeeperModule.mapClassInitializer('keeperJwtConfig', KeeperJwtConfig)