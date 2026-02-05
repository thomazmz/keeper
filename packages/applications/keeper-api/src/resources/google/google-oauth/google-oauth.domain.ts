export type GoogleOauth = {
  readonly id: string
  readonly createdAt: Date,
  readonly updatedAt: Date
  readonly email: GoogleOauth.ProfileMetadata['email']
  readonly sourceId: GoogleOauth.ProfileMetadata['sourceId']
  readonly refreshToken: GoogleOauth.Metadata['refreshToken']
  readonly refreshTokenExpiresAt: GoogleOauth.Metadata['refreshTokenExpiresAt']
  readonly refreshTokenExchangedAt: GoogleOauth.Metadata['refreshTokenExchangedAt']
}

export declare namespace GoogleOauth {
  export type Metadata = {
    readonly refreshToken: string
    readonly refreshTokenExpiresAt: number
    readonly refreshTokenExchangedAt: number
  }

  export type ProfileMetadata = {
    readonly email: string
    readonly sourceId: string
  }
}
