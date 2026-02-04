
import { HttpStatus } from '@nodelith/http'
import { HttpMethod } from '@nodelith/http'
import { Controller } from '@nodelith/controller'

import { ConnectWithGoogleRequestContract } from './oauth.contracts'
import { KeeperOauthService } from '../domain/library'

@Controller.Router('/oauth')
export class OauthController {
  private readonly keeperOauthService: KeeperOauthService

  public constructor(keeperOauthService: KeeperOauthService) {
    this.keeperOauthService = keeperOauthService
  }

  @Controller.Path('/google')
  @Controller.Method(HttpMethod.Post)
  @Controller.SuccessResponse(HttpStatus.Ok)
  @Controller.RequestBody(ConnectWithGoogleRequestContract)
  public async connectWithGoogle(body: ConnectWithGoogleRequestContract) {
    const result = await this.keeperOauthService.connectWithGoogle(body.code)
    return { email: result.email }
  }
}
