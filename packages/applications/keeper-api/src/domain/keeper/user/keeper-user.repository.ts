import { CoreRepository } from "@nodelith/core";
import { User } from './keeper-user.domain'

export interface KeeperUserRepository extends CoreRepository<User> {

}