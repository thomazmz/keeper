import { CoreEntity } from '@nodelith/core'
import { KeeperEmail } from './keeper-email.domain'
import { KeeperEmailRepository } from './keeper-email.repository'

export class KeeperEmailService {
  public constructor(
    private readonly keeperEmailRepository: KeeperEmailRepository
  ) {}

  public async ingestSourcedEmailEntries(entries: CoreEntity.Entries<KeeperEmail>[]): Promise<void> {
    await Promise.all(entries.map((entry) => this.ingestSourcedEmailEntry(entry)))
  }

  public async ingestSourcedEmailEntry(entry: CoreEntity.Entries<KeeperEmail>): Promise<void> {
    if(entry.subject === 'Authorization without credit card present'
      || entry.subject === 'Authorization on your credit account'
    ) {
      return void this.saveSourcedEmailEntry(entry)
    }
  }

  private async saveSourcedEmailEntry(entries: CoreEntity.Entries<KeeperEmail>) {
    const { source, sourceId, ...properties } = entries

    const sourcedEmail = await this.findSourcedEmail({ source, sourceId })

    if(!sourcedEmail) return this.createSourcedEmail({ ...properties,
      sourceId,
      source,
    })

    return this.keeperEmailRepository.updateOneById(sourcedEmail.id, properties)
  }

  private createSourcedEmail(properties: CoreEntity.Entries<KeeperEmail>): Promise<KeeperEmail> {
    return this.keeperEmailRepository.createOne(properties)
  }

  private findSourcedEmail(properties: { sourceId: string, source: string }): Promise<KeeperEmail| undefined> {
    return this.keeperEmailRepository.findOneByQuery(properties)
  }
}
