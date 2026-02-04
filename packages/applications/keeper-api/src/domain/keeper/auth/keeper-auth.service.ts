import { GoogleOauthService } from 'domain/domain.library'
import { KeeperUserService } from 'domain/domain.library'
import { KeeperJwtService } from 'domain/domain.library'

import { KeeperTokenPair } from './keeper-auth.domain'

export class KeeperAuthService {
  private readonly googleOauthService: GoogleOauthService
  private readonly keeperUserService: KeeperUserService
  private readonly keeperJwtService: KeeperJwtService

  public constructor(
    googleOauthService: GoogleOauthService,
    keeperUserService: KeeperUserService,
    keeperJwtService: KeeperJwtService,
  ) {
    this.googleOauthService = googleOauthService
    this.keeperUserService = keeperUserService
    this.keeperJwtService = keeperJwtService
  }

  public async connectWithGoogle(oauthCode: string): Promise<KeeperTokenPair> {
    const googleOauth = await this.googleOauthService.upsertOauthCredentials(oauthCode)

    const keeperUser = await this.keeperUserService.resolveKeeperUser({
      email: googleOauth.email
    })

    return this.createTokenPair({
      subjectKey: keeperUser.id,
      clientKey: 'keeper-web',
      grantType: 'user',
    })
  }

  private async createTokenPair(properties: {
    readonly subjectKey: string,
    readonly clientKey: string,
    readonly grantType: string,
  }): Promise<KeeperTokenPair> {
    return Object.freeze({
      refreshToken: await this.keeperJwtService.createRefreshToken({
        subjectKey: properties.subjectKey,
        grantType: properties.grantType,
        clientKey: properties.clientKey,
      }),
      accessToken: await this.keeperJwtService.createAccessToken({
        subjectKey: properties.subjectKey,
        grantType: properties.grantType,
        clientKey: properties.clientKey,
      })
    })
  }
}
