import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encodeString } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository : Repository<User>
  ){}

  create(createUserInput: CreateUserInput) {
    const password = encodeString(createUserInput.password)
    return this.usersRepository.save({...createUserInput, password});
  }

  findAll() {
    return this.usersRepository.find({
      select:{
        password: false
      }
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: {id},
    });
  }

  findEmail(email: string){
    return this.usersRepository.findOne({
      where: {email},
    })
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.usersRepository.update(id, updateUserInput);
  }

  remove(id: number) {
    return this.usersRepository.delete(id)
  }
}
