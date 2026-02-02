export type GoogleOauth = {
  readonly id: string
  readonly createdAt: Date,
  readonly updatedAd: Date
  readonly email: GoogleOauth.ProfileMetadata['email']
  readonly sourceId: GoogleOauth.ProfileMetadata['sourceId']
  readonly refreshToken: GoogleOauth.CredentialsMetadata['refreshToken']
  readonly refreshTokenExpiresAt: GoogleOauth.CredentialsMetadata['refreshTokenExpiresAt']
  readonly refreshTokenExchangedAt: GoogleOauth.CredentialsMetadata['refreshTokenExchangedAt']
}

export declare namespace GoogleOauth {
  export type CredentialsMetadata = {
    readonly refreshToken: string
    readonly refreshTokenExpiresAt: number
    readonly refreshTokenExchangedAt: number
  }

  export type ProfileMetadata = {
    readonly email: string
    readonly sourceId: string
  }
}
