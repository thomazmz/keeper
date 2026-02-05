
import { HttpStatus } from '@nodelith/http'
import { HttpMethod } from '@nodelith/http'
import { Controller } from '@nodelith/controller'

import { ConnectWithGoogleRequest } from './oauth.contracts'
import { KeeperAuthService } from '@keeper/api/resources'
import { KeeperTokenPair } from '@keeper/api/resources'

@Controller.Router('/auth')
export class KeeperAuthController {
  private readonly keeperAuthService: KeeperAuthService

  public constructor(keeperAuthService: KeeperAuthService) {
    this.keeperAuthService = keeperAuthService
  }

  @Controller.Path('/google')
  @Controller.Method(HttpMethod.Post)
  @Controller.SuccessResponse(HttpStatus.Ok)
  @Controller.RequestBody(ConnectWithGoogleRequest)
  public async connectWithGoogle(body: ConnectWithGoogleRequest): Promise<KeeperTokenPair> {
    return this.keeperAuthService.connectWithGoogle(body.code)
  }
}
