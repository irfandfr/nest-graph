import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [AuthService, UsersService, AuthResolver],
})
export class AuthModule {}
