import { GoogleEmailClient, GoogleInbox, GoogleOauthService, KeeperEmailService, KeeperUser } from '@keeper/domain'
import { GoogleInboxService } from '@keeper/domain'

export class KeeperListenerService {
  public constructor(
    private readonly keeperEmailService: KeeperEmailService,
    private readonly googleInboxService: GoogleInboxService,
    private readonly googleOauthService: GoogleOauthService,
    private readonly googleEmailClient: GoogleEmailClient,
  ) {}

  public async processGoogleInboxPush({ email, cursor }: GoogleInbox.Metadata): Promise<void> {
    const inbox = await this.googleInboxService.getGoogleInboxByEmail(email)

    const oauth = await this.googleOauthService.getGoogleOauthByEmail(email)

    const messages = await this.googleEmailClient.getEmailMessagesMetadata(oauth, inbox)

    return this.keeperEmailService.ingestSourcedEmailEntries(messages)
  }
}
