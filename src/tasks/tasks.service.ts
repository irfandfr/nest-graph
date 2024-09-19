import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskInput: CreateTaskInput) {
    let dependency = null;
    if (createTaskInput.dependency) {
      dependency = await this.findOne(createTaskInput.dependency);
      if (!dependency)
        throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    return this.taskRepository.save({
      ...createTaskInput,
      taskDependency: dependency,
    });
  }

  async findAll() {
    return (
      await this.taskRepository.find({
        relations: ['taskDependency'],
      })
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['taskDependency'],
    });
  }

  /**
   * Find all task with dependency of {id}
   * @param {number} id tasks dependency id
   * @returns {Promise<Task[]>} List of task with task dependency of {id}
   */
  findByTaskDependencyID(id: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        taskDependency: {
          id: id,
        },
      },
      relations: ['taskDependency'],
    });
  }

  async findReady() {
    const openTasks = await this.taskRepository.find({
      where: {
        status: 'open',
      },
      relations: ['taskDependency'],
    });
    const tasks = openTasks.filter(
      (t) => !t.taskDependency || t.taskDependency?.status === 'done',
    );
    // sort by time
    return tasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }


  async update(updateTaskInput: UpdateTaskInput): Promise<Task> {
    if (this.findOne(updateTaskInput.id)) {
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }

    if (updateTaskInput.id === updateTaskInput.dependency) {
      throw new HttpException(
        'Task ID and Task dependeency ID cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }

    let dependency = null;

    if (updateTaskInput.dependency) {
      dependency = await this.findOne(updateTaskInput.dependency);
      if (!dependency)
        // if dependency is supplied and not found, throw error
        throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }

    // delete dependency from updateTaskInput to prevent pushing to db
    delete updateTaskInput.dependency;
    await this.taskRepository.update(updateTaskInput.id, {
      ...updateTaskInput,
      taskDependency: dependency,
    });
    return this.findOne(updateTaskInput.id);
  }

  
  async remove(id: number): Promise<boolean> {
    // remove all task with a dependency of the reemoved Task id
    const dependedTask = await this.findByTaskDependencyID(id);
    if (dependedTask.length > 0) {
      dependedTask.forEach((task) => {
        this.update({ id: task.id });
      });
    }
    const result = await this.taskRepository.delete({ id });
    return result.affected > 0;
  }
}
