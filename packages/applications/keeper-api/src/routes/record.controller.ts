import { HttpMethod } from '@nodelith/http'
import { HttpStatus } from '@nodelith/http'
import { Controller } from '@nodelith/controller'
import { KeeperRecord } from '@keeper/api/resources'
import { KeeperRecordService } from '@keeper/api/resources'
import { CreateRecordRequestBody } from './record.contracs'
import { RecordDto } from './record.contracs'

@Controller.Router('/api/records')
export class KeeperRecordController {
  public constructor(
    private readonly keeperRecordService: KeeperRecordService
  ) {}

  private static mapKeeperRecordDto(record: KeeperRecord) {
    return {
      id: record.id,
      title: record.title,
      ammount: record.ammount,
      merchant: record.merchant,
      updatedAt: record.updatedAt.toISOString(),
      createdAt: record.createdAt.toISOString(),
    }
  }

  @Controller.Path('/:id')
  @Controller.Method(HttpMethod.Get)
  @Controller.SuccessResponse(HttpStatus.Ok, RecordDto)
  public async getRecord(id: string): Promise<RecordDto> {
    const record = await this.keeperRecordService.getRecordById(id)
    return KeeperRecordController.mapKeeperRecordDto(record)
  }

  @Controller.Path('/:id')
  @Controller.Method(HttpMethod.Get)
  @Controller.RequestBody(CreateRecordRequestBody)
  @Controller.SuccessResponse(HttpStatus.Ok, RecordDto)
  public async createRecord(body: CreateRecordRequestBody): Promise<RecordDto> {
    const record = await this.keeperRecordService.createRecord(body)
    return KeeperRecordController.mapKeeperRecordDto(record)
  }
}
