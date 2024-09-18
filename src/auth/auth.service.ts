import { Injectable } from '@nestjs/common';
import { AuthPayload } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { compareString } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService : UsersService,
  ){}

  async validateAuth({email, password} : AuthPayload){
    const user = this.userService.findEmail(email)
    if(user && compareString(password, (await user).password)){
      return user
    }
    return null
  }
}
