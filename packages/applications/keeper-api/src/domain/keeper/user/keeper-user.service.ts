import { KeeperUserRepository } from './keeper-user.repository';
import { User } from './keeper-user.domain';

import crypto from 'crypto';

export class KeeperUserService {
  public readonly keeperUserRepository: KeeperUserRepository

  public constructor(keeperUserRepository: KeeperUserRepository) {
    this.keeperUserRepository = keeperUserRepository
  }

  public async resolveKeeperUser(properties: { email: string }): Promise<User> {
    const keeperUser = await this.findKeeperUser(properties)
    if(!keeperUser) return this.createKeeperUser(properties)
    return keeperUser
  }

  public async findKeeperUser(properties: { email: string }): Promise<User | undefined> {
    // return this.keeperUserRepository.findOneByQuery(properties)
    return {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      email: properties.email,
    }
  }

  private async createKeeperUser(properties: { email: string }): Promise<User> {
    return this.keeperUserRepository.createOne(properties)
  }
}
