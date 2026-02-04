import { InjectionModule } from "@nodelith/injection";
import { KeeperJwtConfig } from "./jwt/keeper-jwt.config";
import { KeeperJwtService } from "./jwt/keeper-jwt.service";
import { KeeperAuthService } from "./auth/keeper-auth.service";
import { KeeperUserService } from "./user/keeper-user.service";

export const KeeperModule = InjectionModule.create()
KeeperModule.mapClassRegistration('keeperUserService', KeeperUserService)
KeeperModule.mapClassRegistration('keeperAuthService', KeeperAuthService)
KeeperModule.mapClassRegistration('keeperJwtService', KeeperJwtService)
KeeperModule.mapClassInitializer('keeperJwtConfig', KeeperJwtConfig)