import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';

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
    return this.tasksService.findOne(id);
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
