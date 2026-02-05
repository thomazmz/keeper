export declare namespace GoogleEmail {
  export type MessageMetadata = {
    readonly date: Date;
    readonly sender: string;
    readonly subject: string;
    readonly sourceId: string;
    readonly recipient: string;
  }

  export type ContentMetadata = {
    readonly data: string,
    readonly type: (
      | 'text/plain'
      | 'text/html'
    ),
  }
}