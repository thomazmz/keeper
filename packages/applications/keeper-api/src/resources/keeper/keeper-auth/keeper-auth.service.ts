import { KeeperJwtService } from '@keeper/api/resources'
import { KeeperUserService } from '@keeper/api/resources'
import { GoogleOauthService } from '@keeper/api/resources'
import { GoogleInboxService } from '@keeper/api/resources'
import { KeeperTokenPair } from './keeper-auth.domain'

export class KeeperAuthService {
  public constructor(
    private readonly googleInboxService: GoogleInboxService,
    private readonly googleOauthService: GoogleOauthService,
    private readonly keeperUserService: KeeperUserService,
    private readonly keeperJwtService: KeeperJwtService,
  ) { }

  public async connectWithGoogle(oauthCode: string): Promise<KeeperTokenPair> {
    const oauth = await this.googleOauthService.upsertOauth(oauthCode)

    const inbox = await this.googleInboxService.findInbox(oauth.email)

    if(!inbox) {
      await this.googleInboxService.createInbox(oauth.email)
    }


    const keeperUser = await this.keeperUserService.upsertUser({
      email: oauth.email
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
