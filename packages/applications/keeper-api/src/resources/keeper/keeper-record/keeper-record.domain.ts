export type KeeperRecord = {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly ownerId: string
  readonly merchant: string
  readonly ammount: number
  readonly title: string
}