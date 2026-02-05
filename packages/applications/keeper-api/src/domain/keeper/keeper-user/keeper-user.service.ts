import { KeeperUserRepository } from './keeper-user.repository';
import { KeeperUser } from './keeper-user.domain';

export class KeeperUserService {
  public constructor(
    private readonly keeperUserRepository: KeeperUserRepository
  ) {}

  public async resolveKeeperUserByEmail(email: string): Promise<KeeperUser> {
    const keeperUser = await this.findKeeperUserByEmail(email)
    if(!keeperUser) return this.createKeeperUserByEmail(email)
    return keeperUser
  }

  public async findKeeperUserByEmail(email: string): Promise<KeeperUser | undefined> {
    return this.keeperUserRepository.findOneByQuery({ email })
  }

  private async createKeeperUserByEmail(email: string): Promise<KeeperUser> {
    return this.keeperUserRepository.createOne({ email })
  }
}
