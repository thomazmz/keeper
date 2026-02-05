import { Contract } from '@nodelith/contract'

export type ConnectWithGoogleRequest = Contract.Infer<typeof ConnectWithGoogleRequest>

export const ConnectWithGoogleRequest = Contract.object({
  code: Contract.string().required()
})

