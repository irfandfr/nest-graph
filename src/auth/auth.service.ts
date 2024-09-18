import { Injectable } from '@nestjs/common';
import { AuthPayload } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { compareString } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService : UsersService,
    private readonly jwtService : JwtService
  ){}

  async validateAuth({email, password} : AuthPayload){
    const user = this.userService.findEmail(email)
    if(user && compareString(password, (await user).password)){
      return user
    }
    return null
  }

  async signIn(id: number, email: string, role?: string){
    const payload = { email, id, role };
      return {
        access_token: this.jwtService.sign(payload, {secret: process.env.JWT_SECRET_KEY}),
      };
  }
}
