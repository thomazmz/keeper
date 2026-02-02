import { GoogleConfig } from '../google-config'

export type GoogleOauthConfig = GoogleConfig & {
  readonly redirectUri: string
}

  