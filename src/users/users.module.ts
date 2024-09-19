import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersResolver, UsersService, {
    provide: APP_GUARD,
    useClass: GqlAuthGuard
  }],
})
export class UsersModule {}
