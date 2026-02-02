import z from 'zod';

import { HttpClient } from '../http/HttpClient';

export const ConnectGoogleResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAd: z.string(),
  email: z.string(),
  sourceId: z.string(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.number(),
  refreshTokenExchangedAt: z.number(),
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
