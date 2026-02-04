import { ConfigInitializer } from '@nodelith/config';
import { ConfigProfile } from '@nodelith/config';

export type KeeperJwtConfigRecord = {
  readonly issuer: string
  readonly audience: string
  readonly keyId: string
  readonly privateKey: string
  readonly publicKey: string
  readonly accessLifespan: number
  readonly refreshLifespan: number
}

export class KeeperJwtConfig extends ConfigInitializer<KeeperJwtConfigRecord> {
  public readonly profile: ConfigProfile<KeeperJwtConfigRecord> = Object.freeze({
    keyId: ConfigProfile.string('KEEPER_JWT_KEYID'),
    issuer: ConfigProfile.string('KEEPER_JWT_ISSUER'),
    audience: ConfigProfile.string('KEEPER_JWT_AUDIENCE'),
    publicKey: ConfigProfile.string('KEEPER_JWT_PUBLIC_KEY'),
    privateKey: ConfigProfile.string('KEEPER_JWT_PRIVATE_KEY'),
    accessLifespan: ConfigProfile.number('KEEPER_JWT_ACCESS_LIFESPAN'),
    refreshLifespan: ConfigProfile.number('KEEPER_JWT_REFRESH_LIFESPAN'),
  })
}
