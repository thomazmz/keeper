import { InjectionModule } from "@nodelith/injection"

export const ResourcesModule = InjectionModule.create()

/////////////////////////
// KeeperUser
export type * from "./keeper/keeper-user/keeper-user.domain"
export type * from "./keeper/keeper-user/keeper-user.service"
import { KeeperUserService } from "./keeper/keeper-user/keeper-user.service"
import { KeeperUserRepository } from "./keeper/keeper-user/keeper-user.repository"
ResourcesModule.mapClassRegistration("keeperUserRepository", KeeperUserRepository)
ResourcesModule.mapClassRegistration("keeperUserService", KeeperUserService)

/////////////////////////
// KeeperRecord
export type * from "./keeper/keeper-record/keeper-record.domain"
export type * from "./keeper/keeper-record/keeper-record.service"
import { KeeperRecordService } from "./keeper/keeper-record/keeper-record.service"
import { KeeperRecordRepository } from "./keeper/keeper-record/keeper-record.repository"
ResourcesModule.mapClassRegistration("keeperRecordRepository", KeeperRecordRepository)
ResourcesModule.mapClassRegistration("keeperRecordService", KeeperRecordService)

/////////////////////////
// KeeperJwt
export type * from "./keeper/keeper-jwt/keeper-jwt.domain"
export type * from "./keeper/keeper-jwt/keeper-jwt.service"
import { KeeperJwtService } from "./keeper/keeper-jwt/keeper-jwt.service"
import { KeeperJwtConfigInitializer } from "./keeper/keeper-jwt/keeper-jwt.config"
ResourcesModule.mapClassInitializer("keeperJwtConfig", KeeperJwtConfigInitializer)
ResourcesModule.mapClassRegistration("keeperJwtService", KeeperJwtService)

/////////////////////////
// KeeperAuth
export type * from "./keeper/keeper-auth/keeper-auth.service"
export type * from "./keeper/keeper-auth/keeper-auth.domain"
import { KeeperAuthService } from "./keeper/keeper-auth/keeper-auth.service"
ResourcesModule.mapClassRegistration("keeperAuthService", KeeperAuthService)

/////////////////////////
// Google
export type * from "./google/google.config"
import { GoogleConfigInitializer } from "./google/google.config"
ResourcesModule.mapClassInitializer("googleConfig", GoogleConfigInitializer)

/////////////////////////
// GoogleOauth
export type * from "./google/google-oauth/google-oauth.client"
export type * from "./google/google-oauth/google-oauth.domain"
export type * from "./google/google-oauth/google-oauth.service"
import { GoogleOauthClient } from "./google/google-oauth/google-oauth.client"
import { GoogleOauthService } from "./google/google-oauth/google-oauth.service"
import { GoogleOauthRepository } from "./google/google-oauth/google-oauth.repository"
ResourcesModule.mapClassRegistration("googleOauthClient", GoogleOauthClient)
ResourcesModule.mapClassRegistration("googleOauthService", GoogleOauthService)
ResourcesModule.mapClassRegistration("googleOauthRepository", GoogleOauthRepository)

/////////////////////////
// GoogleInbox
export type * from "./google/google-inbox/google-inbox.client"
export type * from "./google/google-inbox/google-inbox.domain"
export type * from "./google/google-inbox/google-inbox.service"
import { GoogleInboxClient } from "./google/google-inbox/google-inbox.client"
import { GoogleInboxService } from "./google/google-inbox/google-inbox.service"
import { GoogleInboxRepository } from "./google/google-inbox/google-inbox.repository"
ResourcesModule.mapClassRegistration("googleInboxClient", GoogleInboxClient)
ResourcesModule.mapClassRegistration("googleInboxService", GoogleInboxService)
ResourcesModule.mapClassRegistration("googleInboxRepository", GoogleInboxRepository)

/////////////////////////
// GoogleEmail
export type * from "./google/google-email/google-email.client"
export type * from "./google/google-email/google-email.domain"
export type * from "./google/google-email/google-email.service"
import { GoogleEmailClient } from "./google/google-email/google-email.client"
import { GoogleEmailService } from "./google/google-email/google-email.service"
ResourcesModule.mapClassRegistration("googleEmailClient", GoogleEmailClient)
ResourcesModule.mapClassRegistration("googleEmailService", GoogleEmailService)
