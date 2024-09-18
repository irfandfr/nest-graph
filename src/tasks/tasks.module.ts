import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Task])],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
