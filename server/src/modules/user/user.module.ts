import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { UserRoleRepository } from './repositories/user-role.repository';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [UploadModule, AddressModule],
  exports: [UserRepository, UserRoleRepository],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository],
})
export class UserModule {}
