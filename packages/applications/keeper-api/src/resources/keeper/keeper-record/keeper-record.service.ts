
import { CoreEntity } from "@nodelith/core";
import { KeeperRecord } from "./keeper-record.domain";
import { KeeperRecordRepository } from "./keeper-record.repository";
import { HttpBadRequestError } from "@nodelith/http";

export class KeeperRecordService {
  public constructor(
    private readonly keeperRecordRepository: KeeperRecordRepository
  ) {}

  public async findRecordById(id: string): Promise<KeeperRecord | undefined> {
    return this.keeperRecordRepository.findOneById(id)
  }

  public async getRecordById(id: string): Promise<KeeperRecord> {
    const record = await this.findRecordById(id)
    return record ?? HttpBadRequestError.throw(`Could not get record with id ${id}. Record does not exist.`)
  }

  public async createRecord(entries: CoreEntity.Entries<KeeperRecord>): Promise<KeeperRecord> {
    return this.keeperRecordRepository.createOne(entries)
  }

  public async updateRecord(id: string, entries: CoreEntity.Entries<KeeperRecord>): Promise<KeeperRecord> {
    const record = await this.keeperRecordRepository.updateOneById(id, entries)
    return record ?? HttpBadRequestError.throw(`Could not update record with id ${id}. Record does not exist.`)
  }

  public deleteRecord(id: string): Promise<void> {
    return this.keeperRecordRepository.deleteOneById(id)
  }
}
