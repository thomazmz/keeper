import { Contract } from '@nodelith/contract'

export type PubsubNotification = Contract.Infer<typeof PubsubNotification>

export const PubsubNotification = Contract.object({
  data: Contract.string()
})