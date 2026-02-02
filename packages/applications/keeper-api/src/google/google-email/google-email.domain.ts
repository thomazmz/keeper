export declare namespace GoogleEmail {
  export type Inbox = {
    readonly id: string
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly history: GoogleEmail.InboxMetadata['history']
    readonly address: GoogleEmail.InboxMetadata['address']
  }

  export type InboxMetadata = {
    readonly history: string
    readonly address: string
  }

  export type Message = {
    readonly id: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly date: Date,
    readonly sender: GoogleEmail.MessageMetadata['sender']
    readonly subject: GoogleEmail.MessageMetadata['subject']
    readonly sourceId: GoogleEmail.MessageMetadata['sourceId']
    readonly recipient: GoogleEmail.MessageMetadata['recipient']
  }

  export type MessageMetadata = {
    readonly date: Date;
    readonly sender: string;
    readonly subject: string;
    readonly sourceId: string;
    readonly recipient: string;
  }

  export type Content = {
    readonly id: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly data: ContentMetadata['data']
    readonly type: ContentMetadata['type']
  }

  export type ContentMetadata = {
    readonly data: string,
    readonly type: (
      | 'text/plain'
      | 'text/html'
    ),
  }
}