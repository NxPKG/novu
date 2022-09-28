import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { EnvironmentWithSubscriber } from '../../../shared/commands/project.command';

export class GetUnseenCountCommand extends EnvironmentWithSubscriber {
  @IsOptional()
  @IsArray()
  feedId: string[];

  @IsBoolean()
  @IsOptional()
  seen?: boolean;
}
