import crypto from 'crypto'
import token, { JwtPayload } from 'jsonwebtoken'
import { HttpInternalServerError } from '@nodelith/http'
import { KeeperJwtConfig } from './keeper-jwt.config'
import { KeeperJwtClaims } from './keeper-jwt.domain'

export class KeeperJwtService {
  private static readonly ALGORITHM = 'RS256' as const

  private static createTimeOffset(duration: number) {
    const currentTime = Date.now()
    const offsetTime = currentTime + duration
    return [currentTime, offsetTime]
  }

  public constructor(
    private readonly keeperJwtConfig: KeeperJwtConfig
  ) {}

  public async extractTokenClaims(encodedToken: string): Promise<KeeperJwtClaims> {
    const rawPayload = JSON.parse(Buffer.from(encodedToken.split('.')[1], 'base64').toString())
    return this.convertJwtClaims(rawPayload)
  }

  public async verifyToken(encodedToken: string): Promise<KeeperJwtClaims> {
    return new Promise((resolve, reject) => {
      const options = { algorithms: [ KeeperJwtService.ALGORITHM ]}

      const key = this.keeperJwtConfig.publicKey

      token.verify(encodedToken, key, options, (error: null | Error, payload: Record<string, any>) => {
        if (!error) resolve(this.convertJwtClaims(payload))
        else reject(error) 
      })
    })
  }

  public async createAccessToken(properties: {
    readonly clientKey: string,
    readonly grantType: string,
    readonly subjectKey: string,
  }): Promise<string> {
    const lifespan = this.keeperJwtConfig.accessLifespan
    const initializedPayload = this.initializeJwtPayload(lifespan, properties)
    return this.signJwt(initializedPayload)
  }

  public async createRefreshToken(properties: {
    readonly clientKey: string,
    readonly grantType: string,
    readonly subjectKey: string,
  }): Promise<string> {
    const lifespan = this.keeperJwtConfig.refreshLifespan
    const initializedPayload = this.initializeJwtPayload(lifespan, properties)
    return this.signJwt(initializedPayload)
  }

  private initializeJwtPayload(lifespan: number, properties: {
    readonly clientKey: string,
    readonly grantType: string,
    readonly subjectKey: string,
  }) {
    const [iat, eat] = KeeperJwtService.createTimeOffset(lifespan)

    return {
      aud: [this.keeperJwtConfig.audience],
      iss: this.keeperJwtConfig.issuer,
      jti: crypto.randomUUID(),
      clt: properties.clientKey,
      gty: properties.grantType,
      sub: properties.subjectKey,
      iat,
      eat,
    }
  }

  private async signJwt(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const key = this.keeperJwtConfig.privateKey
      const headers = {
        algorithm: KeeperJwtService.ALGORITHM,
        keyid: this.keeperJwtConfig.keyId,
      }
      token.sign(payload, key, headers, (error: Error, token: string) => {
        if (!error) resolve(token)
        else reject(error)
      })
    })
  }

  private convertJwtClaims(rawPayload: Record<string, any>): KeeperJwtClaims {
    if (!rawPayload.aud || !Array.isArray(rawPayload.aud)) {
      throw new HttpInternalServerError('invalid aud claim')
    } else if (!rawPayload.jti || typeof rawPayload.jti !== 'string') {
      throw new HttpInternalServerError('missing jti claim')
    } else if (!rawPayload.iss || typeof rawPayload.iss !== 'string') {
      throw new HttpInternalServerError('missing iss claim')
    } else if (!rawPayload.sub || typeof rawPayload.sub !== 'string') {
      throw new HttpInternalServerError('missing sub claim')
    } else if (!rawPayload.gty || typeof rawPayload.gty !== 'string') {
      throw new HttpInternalServerError('missing gty claim')
    } else if (!rawPayload.clt || typeof rawPayload.clt !== 'string') {
      throw new HttpInternalServerError('missing clt claim')
    } else if (!rawPayload.iat || typeof rawPayload.iat !== 'number') {
      throw new HttpInternalServerError('missing iat claim')
    } else if (!rawPayload.eat || typeof rawPayload.eat !== 'number') {
      throw new HttpInternalServerError('missing eat claim')
    } else {
      return {
        aud: rawPayload.aud as string[],
        jti: rawPayload.jti,
        iss: rawPayload.iss,
        gty: rawPayload.gty,
        sub: rawPayload.sub,
        iat: rawPayload.iat,
        eat: rawPayload.eat,
        clt: rawPayload.clt,
      }
    }
  }
}
