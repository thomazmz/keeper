import { GoogleEmail, GoogleEmailClient, GoogleInbox, GoogleOauthService } from '@keeper/domain'
import { GoogleInboxService } from '@keeper/domain'

export class KeeperListenerService {
  private readonly googleInboxService: GoogleInboxService
  private readonly googleOauthService: GoogleOauthService
  private readonly googleEmailClient: GoogleEmailClient

  public constructor(
    googleInboxService: GoogleInboxService,
    googleOauthService: GoogleOauthService,
    googleEmailClient: GoogleEmailClient,
  ) {
    this.googleInboxService = googleInboxService
    this.googleOauthService = googleOauthService
    this.googleEmailClient = googleEmailClient
  }

  public async processGoogleInboxPush({ email, cursor }: GoogleInbox.Metadata): Promise<void> {
    const inbox = await this.googleInboxService.getGoogleInboxByEmail(email)

    const oauth = await this.googleOauthService.getGoogleOauthByEmail(email)

    const messages = await this.googleEmailClient.getMessagesMetadata(oauth, inbox)

    const scotiabankMessages = messages.filter(message => {
      return false
        || message.subject === 'Authorization on your credit account'
        || message.subject === 'Authorization without credit card present'
    })

    console.log('Messages from Scotiabank: ', scotiabankMessages)
  }
}