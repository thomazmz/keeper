import { HttpBadRequestError } from "@nodelith/http"
import { GoogleOauthService } from "@keeper/domain"
import { GoogleInbox } from "./google-inbox.domain"
import { GoogleInboxClient } from "./google-inbox.client"
import { GoogleInboxRepository } from './google-inbox.repository.ts'

export class GoogleInboxService {
  private readonly googleInboxRepository: GoogleInboxRepository
  private readonly googleOauthService: GoogleOauthService
  private readonly googleInboxClient: GoogleInboxClient

  public constructor(
    googleInboxRepository: GoogleInboxRepository,
    googleOauthService: GoogleOauthService,
    googleInboxClient: GoogleInboxClient,
  ) {
    this.googleInboxRepository = googleInboxRepository
    this.googleOauthService = googleOauthService
    this.googleInboxClient = googleInboxClient
  }

  public async findGoogleInboxByEmail(email: string): Promise<GoogleInbox | undefined> {
    return this.googleInboxRepository.findOneByQuery({ email })
  }

  public async getGoogleInboxByEmail(email: string): Promise<GoogleInbox> {
    const emailInbox = await this.findGoogleInboxByEmail(email)
    if(!emailInbox) throw new HttpBadRequestError(`Could not find GoogleInbox by email ${email}.`)
    return emailInbox
  }

  public async upsertGoogleInboxByEmail(email:string, cursor: string): Promise<GoogleInbox | undefined> {
    const emailInbox = this.findGoogleInboxByEmail(email)
    if(!emailInbox) return this.createGoogleInboxByEmail(email, cursor)
    return this.updateGoogleInboxByEmail(email, cursor)
  }

  public async resolveGoogleInboxByEmail(email: string): Promise<GoogleInbox> {
    const emailInbox = await this.findGoogleInboxByEmail(email)
    if(emailInbox) return emailInbox
    const oauthCredentials = await this.googleOauthService.getGoogleOauthByEmail(email)
    const emailMetadata = await this.googleInboxClient.getEmailInboxMetadata(oauthCredentials)
    return this.createGoogleInboxByEmail(email, emailMetadata.cursor)
  }

  private async createGoogleInboxByEmail(email:string, cursor: string): Promise<GoogleInbox> {
    return this.googleInboxRepository.createOne({cursor, email })
  }

  private async updateGoogleInboxByEmail(email: string, cursor: string): Promise<GoogleInbox | undefined> {
    const currentInbox = await this.getGoogleInboxByEmail(email)
    const updatedInbox = this.googleInboxRepository.updateOneById(currentInbox.id, { cursor })

    return updatedInbox ?? HttpBadRequestError.throw(
      `Could not find Inbox instance with id ${currentInbox.id}`
    )
  }
}
