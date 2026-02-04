import { KeeperUserRepository } from './keeper-user.repository';
import { KeeperUser } from './keeper-user.domain';

export class KeeperUserService {
  public readonly keeperUserRepository: KeeperUserRepository

  public constructor(keeperUserRepository: KeeperUserRepository) {
    this.keeperUserRepository = keeperUserRepository
  }

  public async resolveKeeperUser(properties: { email: string }): Promise<KeeperUser> {
    const keeperUser = await this.findKeeperUser(properties)
    if(!keeperUser) return this.createKeeperUser(properties)
    return keeperUser
  }

  public async findKeeperUser(properties: { email: string }): Promise<KeeperUser | undefined> {
    return this.keeperUserRepository.findOneByQuery(properties)
  }

  private async createKeeperUser(properties: { email: string }): Promise<KeeperUser> {
    return this.keeperUserRepository.createOne(properties)
  }
}
