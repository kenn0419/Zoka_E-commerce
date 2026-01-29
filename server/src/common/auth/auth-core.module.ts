import { Global, Module } from '@nestjs/common';
import { AuthCoreService } from './auth-core.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [AuthCoreService],
  exports: [AuthCoreService],
})
export class AuthCoreModule {}
