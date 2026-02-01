import z from 'zod';

import { HttpClient } from '../http/HttpClient';

export const ConnectGoogleResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export declare namespace OauthApi {
  export type ConnectWithGoogleRequest = {
    readonly code: string;
  };

  export type ConnectWithGoogleError = {
    message: string
  }
    

  export type ConnectWithGoogleResponse =
    z.infer<typeof ConnectGoogleResponseSchema>
}

export const OauthApi = Object.freeze({
  async connectWithGoogle(request: OauthApi.ConnectWithGoogleRequest): Promise<OauthApi.ConnectWithGoogleResponse> {
    return (await HttpClient.instance.post('/api/oauth/google', {
      schema: ConnectGoogleResponseSchema,
      body: request,
    }))
  }
})
