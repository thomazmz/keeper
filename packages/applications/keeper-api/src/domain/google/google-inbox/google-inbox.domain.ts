export type GoogleInbox = {
  readonly id: string
  readonly createdAt: Date,
  readonly updatedAt: Date,
  readonly cursor: GoogleInbox.Metadata['cursor']
  readonly email: GoogleInbox.Metadata['email']
}

export declare namespace GoogleInbox {
  export type Metadata = {
    readonly cursor: string
    readonly email: string
  }
}