
import { CoreEntity } from "@nodelith/core";
import { HttpBadRequestError } from "@nodelith/http";
import { KeeperUser } from "./keeper-user.domain";
import { KeeperUserRepository } from "./keeper-user.repository";

export class KeeperUserService {
  public constructor(
    private readonly keeperUserRepository: KeeperUserRepository
  ) {}

  public async findUserById(id: string): Promise<KeeperUser | undefined> {
    return this.keeperUserRepository.findOneById(id)
  }

  private async createUser(entries: CoreEntity.Entries<KeeperUser>): Promise<KeeperUser> {
    return this.keeperUserRepository.createOne(entries)
  }

  public async upsertUser(entries: CoreEntity.Entries<KeeperUser>): Promise<KeeperUser> {
    const user = await this.keeperUserRepository.findOneByQuery({
      email: entries.email
    })

    if(!user) {
      return this.createUser(entries)
    }

    const updatedRecord = await this.updateUser(user.id, entries)

    return updatedRecord ?? HttpBadRequestError.throw(
      `Could not find Oauth instance with id ${user.id}`
    )
  }

  public async updateUser(id: string, entries: CoreEntity.Entries<KeeperUser>): Promise<KeeperUser> {
    const user = await this.keeperUserRepository.updateOneById(id, entries)
    return user ?? HttpBadRequestError.throw(`Could not update user with id ${id}. User does not exist.`)
  }
}
