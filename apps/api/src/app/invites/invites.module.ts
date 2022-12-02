import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { InvitesController } from './invites.controller';
import { USE_CASES } from './usecases';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [InvitesController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class InvitesModule {}
