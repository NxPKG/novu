import { Injectable } from '@nestjs/common';
import { FeedEntity, FeedRepository } from '@novu/dal';
import { PromoteTypeChangeCommand } from '../promote-type-change.command';

@Injectable()
export class PromoteFeedChange {
  constructor(private feedRepository: FeedRepository) {}

  async execute(command: PromoteTypeChangeCommand) {
    let item: FeedEntity | undefined = undefined;
    if (command.item.name) {
      item = await this.feedRepository.findOne({
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        name: command.item.name,
      });
    }

    if (!item) {
      return this.feedRepository.create({
        name: command.item.name,
        identifier: command.item.name,
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
      });
    }

    return await this.feedRepository.delete({
      _id: item._id,
    });
  }
}
