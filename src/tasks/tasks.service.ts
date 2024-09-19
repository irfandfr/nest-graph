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

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['taskDependency'],
    });
    return task
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

  /**
   * Find all task with that is ready to be worked on
   * Task that has a status of not 'done' and Task that don't have unfinished status
   * @returns {Promise<Task[]>} List of tasks
   */
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
    const task = await this.findOne(updateTaskInput.id)
    if (!task) {
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
      taskDependency: dependency || task.taskDependency,
    });
    return this.findOne(updateTaskInput.id);
  }

  /**
   * Remove a dependency from a task
   * @param id Task's ID
   */
  async removeDependency(id: number){
    const task = await this.findOne(id)
    if(!task){
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    } else if(!task.taskDependency){
      throw new HttpException('Task does not have a dependency', HttpStatus.BAD_REQUEST);
    }
    const res = await this.taskRepository.update(id, {
      ...task,
      taskDependency: null,
    });
    return res?.affected > 0
  }

  
  async remove(id: number): Promise<boolean> {
    // remove all task with a dependency of the reemoved Task id
    const dependedTask = await this.findByTaskDependencyID(id);
    if (dependedTask.length > 0) {
      dependedTask.forEach((task) => {
        this.removeDependency(task.id)
      });
    }
    const result = await this.taskRepository.delete({ id });
    return result.affected > 0;
  }
}
