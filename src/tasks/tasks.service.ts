import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository : Repository<Task>
  ){}

  async create(createTaskInput: CreateTaskInput) {
    let dependency = null;
    if (createTaskInput.dependency) {
      dependency = await this.findOne(createTaskInput.dependency);
      if (!dependency)
        throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository.save({
      ...createTaskInput,
      taskDependency: dependency
    });
  }

  async findAll() {
    return (
      await this.taskRepository.find({ 
        relations: ['taskDependency'],
        select:{
          taskDependency:{
            id: true
          }
        }
      })
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async findReady() {
    const openTasks = await this.taskRepository.find({
      where: {
        status : 'open',
      },
      relations: ['taskDependency'],
      select:{
        taskDependency:{
          id: true
        }
      }
    });
    return openTasks.filter((t) => !t.taskDependency || (t.taskDependency.status === 'done'))
  }

  async update(updateTaskInput: UpdateTaskInput) {
    let dependency = null;
    if (updateTaskInput.dependency) {
      dependency = (await this.findOne(updateTaskInput.dependency));
      if (!dependency)
        throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    delete updateTaskInput.dependency;
    return this.taskRepository.update(updateTaskInput.id, {
      ...updateTaskInput,
      taskDependency: dependency,
    });
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
