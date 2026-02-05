import { HttpMethod, HttpStatus } from '@nodelith/http';
import { GoogleEmailService } from '@keeper/api/resources';
import { Controller } from '@nodelith/controller';
import { PubsubNotification } from './pubsub.contract';

@Controller.Router('/pubsub')
export class PubsubController {
  public readonly googleEmailService: GoogleEmailService

  public constructor(googleEmailService: GoogleEmailService) {
    this.googleEmailService = googleEmailService
  }
  
  @Controller.Path('/notifications/email')
  @Controller.Method(HttpMethod.Post)
  @Controller.SuccessResponse(HttpStatus.Ok)
  @Controller.RequestBody(PubsubNotification)
  public async pushNotification(body: PubsubNotification): Promise<void> {
    const result = await this.googleEmailService.fetchGoogleEmails(
      'thomaz.zandonotto@gmail.com',
      '10854536',
    )

    console.log(JSON.stringify(result, null, 2))
  }
}