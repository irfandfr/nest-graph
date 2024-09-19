import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  
  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.tasksService.create(createTaskInput);
  }

  @Public()
  @Query(() => [Task], { name: 'tasks' })
  findAll() {
    return this.tasksService.findAll();
  }
  
  @Public()
  @Query(() => [Task], { name: 'readyTasks' })
  findReady() {
    return this.tasksService.findReady();
  }

  @Public()
  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    const task = this.tasksService.findOne(id);
    if(!task)
    throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    return task
  }
  
  @Mutation(() => String)
  removeDependency(@Args('id', {type: () => Int}) id:number){
    const res = this.tasksService.removeDependency(id)
    return res ? 'Dependency remove' : 'Dependency not removed'
  }

  @Mutation(() => Task, {nullable: true})
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput);
  }

  @Roles('admin')
  @Mutation(() => Boolean, {nullable: true})
  async removeTask(@Args('id', { type: () => Int }) id: number) {
    const res =  await this.tasksService.remove(id);
    return res
  }
}
