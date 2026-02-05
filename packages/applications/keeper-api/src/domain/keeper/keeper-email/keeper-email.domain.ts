export type KeeperEmail = {
  readonly id: string,
  readonly createdAt: Date,
  readonly updatedAt: Date,
  readonly date: Date;
  readonly sender: string;
  readonly subject: string;
  readonly source: string;
  readonly sourceId: string;
  readonly recipient: string;
  // readonly data: string,
  // readonly type: (
  //   | 'text/plain'
  //   | 'text/html'
  // ),
}

export declare namespace KeeperEmail {
  export type MessageMetadata = {
    readonly date: Date;
    readonly sender: string;
    readonly subject: string;
    readonly source: string;
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