import { HttpMethod, HttpStatus } from '@nodelith/http';
import { Controller } from '@nodelith/controller';
import { KeeperListenerService } from '@keeper/domain';
import { PubsubNotification } from './pubsub.contract';

@Controller.Router('/pubsub')
export class PubsubController {
  public readonly keeperListenerService: KeeperListenerService

  public constructor(keeperListenerService: KeeperListenerService) {
    this.keeperListenerService = keeperListenerService
  }
  
  @Controller.Path('/notifications/email')
  @Controller.Method(HttpMethod.Post)
  @Controller.SuccessResponse(HttpStatus.Ok)
  @Controller.RequestBody(PubsubNotification)
  public async pushNotification(body: PubsubNotification): Promise<void> {
    await this.keeperListenerService.processGoogleInboxPush({
      email: 'thomaz.zandonotto@gmail.com',
      cursor: '123131321',
    })
  }
}