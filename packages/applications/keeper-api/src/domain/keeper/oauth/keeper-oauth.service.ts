import { GoogleOauthService } from '../../google/google.library'

export class KeeperOauthService {
  private readonly googleOauthService: GoogleOauthService

  public constructor(googleOauthService: GoogleOauthService) {
    this.googleOauthService = googleOauthService
  }

  public async connectWithGoogle(code: string) {
    return this.googleOauthService.upsertOauthCredentials(code)
  }
}