import z from 'zod';

import { HttpClient } from '../http/HttpClient';

export const ConnectGoogleResponseSchema = z.object({
  email: z.string()
})

export declare namespace AuthApi {
  export type ConnectWithGoogleRequest = {
    readonly code: string;
  };

  export type ConnectWithGoogleError = {
    message: string
  }

  export type ConnectWithGoogleResponse =
    z.infer<typeof ConnectGoogleResponseSchema>
}

export const AuthApi = Object.freeze({
  async connectWithGoogle(request: AuthApi.ConnectWithGoogleRequest): Promise<AuthApi.ConnectWithGoogleResponse> {
    return (await HttpClient.instance.post('/auth/google', {
      schema: ConnectGoogleResponseSchema,
      body: request,
    }))
  }
})
