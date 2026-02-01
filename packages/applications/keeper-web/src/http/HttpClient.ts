import z from 'zod'

export type HttpOptions<T> = {
  schema?: z.ZodType<T>
  header?: any,
  body?: any,
}

export class HttpClient {
  private static singleton: HttpClient

  public static get instance() {
    if(!this.singleton) this.singleton = new HttpClient()
    return this.singleton
  }

  public readonly base: string

  protected constructor(base?: string) {
    this.base = base ?? import.meta.env.VITE_KEEPER_API_BASE_URL
  }

  private resolveUrl(path: string): string {
    return `${this.base}${path}`
  }

  private async request<T>(method: string, path: string, options?: HttpOptions<T>): Promise<T> {
    const { schema, ...requestOptions } = options ?? {}

    const response = await fetch(this.resolveUrl(path), { ...requestOptions,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestOptions.body),
      method
    })

    const responseData = await response.json()

    return schema ? schema.parse(responseData) : responseData
  }

  public post<T>(path: string, options?: HttpOptions<T>): Promise<T> {
    return this.request('POST', path, options)
  }

  public get<T>(path: string, options?: HttpOptions<T>): Promise<T> {
    return this.request('GET', path, options)
  }

  public patch<T>(path: string, options?: HttpOptions<T>): Promise<T> {
    return this.request('PATCH', path, options)
  }
}
