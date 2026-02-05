import { Contract } from '@nodelith/contract'

export type RecordDto = Contract.Infer<typeof RecordDto>

export const RecordDto = Contract.object({
  id: Contract.string(),
  title: Contract.string(),
  ammount: Contract.number(),
  merchant: Contract.string(),
  updatedAt: Contract.string(),
  createdAt: Contract.string(),
})

export type CreateRecordRequestBody = Contract.Infer<typeof CreateRecordRequestBody>

export const CreateRecordRequestBody = Contract.object({
  title: Contract.string(),
  ownerId: Contract.string(),
  ammount: Contract.number(),
  merchant: Contract.string(),
  occuredAt: Contract.string(),
})