export type GoogleEmail = {
  readonly date: Date;
  readonly sender: string;
  readonly subject: string;
  readonly sourceId: string;
  readonly recipient: string;
  readonly data: string,
  readonly type: (
    | 'text/plain'
    | 'text/html'
  ),
}

export declare namespace GoogleEmail {
  export type Filter = {
    readonly subject?: string
    readonly sender?: string
  }

  export type Header = {
    readonly date: Date;
    readonly sender: string;
    readonly subject: string;
    readonly sourceId: string;
    readonly recipient: string;
  }

  export type Content = {
    readonly sourceId: string,
    readonly data: string,
    readonly type: (
      | 'text/plain'
      | 'text/html'
    ),
  }
}
