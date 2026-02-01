import { z } from 'zod'

export type GoogleTokenExchangeResponse = {
  accessToken: string;
  refreshToken: string;
}

export class GoogleOauthClient {
  public constructor(
    private readonly googleOauthBaseUrl: string,
    private readonly googleOauthClientId: string,
    private readonly googleOauthRedirectUrl: string,
    private readonly googleOauthClientSecret: string,
  ) {}

  private static readonly TOKEN_EXCHANGE_RESPONSE_SCHEMA = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  });

  public async exchangeToken(code: string): Promise<GoogleTokenExchangeResponse> {
    const request = this.prepareRequest('POST', '/token', GoogleOauthClient.TOKEN_EXCHANGE_RESPONSE_SCHEMA)

    const response = await request({
      client_secret: this.googleOauthClientSecret,
      redirect_uri: this.googleOauthRedirectUrl,
      client_id: this.googleOauthClientId,
      grant_type: 'authorization_code',
      code,
    })

    return Object.freeze({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    })
  }

  private prepareRequest<T>(method: string, path: string, schema: z.ZodType<T>) {
    return (body: Record<string,string>): Promise<T> => {
      return this.request(method, path, body, schema)
    }
  }

  private async request<T>(method: string, path: string, params: Record<string, string>, schema: z.ZodType<T>): Promise<T> {
    const url = new URL(path, this.googleOauthBaseUrl)

    const body = new URLSearchParams(params)

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

    const response = await fetch(url, {
      headers,
      method,
      body,
    })

    const responseBody = await response.json()

    console.log(responseBody)

    if(!response.ok) {
      throw new Error('Token exchange failed')
    }

    const result = schema.safeParse(responseBody)

    if(!result.success) {
      throw new Error(result.error.message)
    }

    return result.data
  }
}
