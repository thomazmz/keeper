import { GoogleOauthService } from "@keeper/api/resources"
import { HttpBadRequestError } from "@nodelith/http"
import { GoogleInbox } from "./google-inbox.domain"
import { GoogleInboxClient } from "./google-inbox.client"
import { GoogleInboxRepository } from './google-inbox.repository'

export class GoogleInboxService {

  public constructor(
    private readonly googleInboxRepository: GoogleInboxRepository,
    private readonly googleOauthService: GoogleOauthService,
    private readonly googleInboxClient: GoogleInboxClient,
  ) {}

  public async getInbox(email: string) {
    const inbox = await this.findInbox(email)
    if(!inbox) HttpBadRequestError.throw(`Could not find GoogleInbox record for email ${email}`)
    return inbox
  }

  public async findInbox(email: string) {
    return this.googleInboxRepository.findOneByQuery({ email })
  }

  public async createInbox(email: string): Promise<GoogleInbox> {
    const oauth = await this.googleOauthService.getOauth(email)
    const metadata = await this.googleInboxClient.getInboxMetadata(oauth)
    return this.googleInboxRepository.createOne({ email, cursor: metadata.cursor })
  }

  public async updateInbox(email: string, cursor: string): Promise<GoogleInbox> {
    const inbox = await this.googleInboxRepository.updateOneByQuery({ email }, { cursor })
    return inbox ??  HttpBadRequestError.throw(`Could not update GoogleInbox record with email ${email}.`)
  }
}
