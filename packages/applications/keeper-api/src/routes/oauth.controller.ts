
import { HttpStatus } from '@nodelith/http'
import { HttpMethod } from '@nodelith/http'
import { Controller } from '@nodelith/controller'

import { ConnectWithGoogleRequestContract } from './oauth.contracts'
import { OauthService } from '../domain/library'

@Controller.Router('/oauth')
export class OauthController {
  private readonly oauthService: OauthService

  public constructor(oauthService: OauthService) {
    this.oauthService = oauthService
  }

  @Controller.Path('/google')
  @Controller.Method(HttpMethod.Post)
  @Controller.SuccessResponse(HttpStatus.Ok)
  @Controller.RequestBody(ConnectWithGoogleRequestContract)
  public async connectWithGoogle(body: ConnectWithGoogleRequestContract): Promise<string> {
    const result = await this.oauthService.connectWithGoogle(body.code)
    return result.email
  }
}
