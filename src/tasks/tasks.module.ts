import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Module({
  imports:[TypeOrmModule.forFeature([Task])],
  providers: [TasksResolver, TasksService, {
    provide: APP_GUARD,
    useClass: GqlAuthGuard
  }],
})
export class TasksModule {}
