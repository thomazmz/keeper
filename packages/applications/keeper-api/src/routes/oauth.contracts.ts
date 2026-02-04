import { Contract } from '@nodelith/contract'

export type ConnectWithGoogleRequestContract = Contract.Infer<typeof ConnectWithGoogleRequestContract>

export const ConnectWithGoogleRequestContract = Contract.object({
  code: Contract.string().required()
})

