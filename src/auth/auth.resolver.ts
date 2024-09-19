import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthPayload } from './dto/auth.input';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './dto/auth.response';
import { Public } from 'src/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService : AuthService,
    private readonly userService : UsersService
  ){}

  @Public()
  @Mutation(() => AuthResponse)
  async signIn(@Args('authPayload') authPayload: AuthPayload) {
    const user =  await this.authService.validateAuth({email:authPayload.email, password: authPayload.password});
    if(user === null){
      throw new UnauthorizedException()
    }else{
      return this.authService.signIn(user.id, user.email, user.role)
    }
  }

  @Public()
  @Mutation(() => User)
  async signUp(@Args('createUserInput') createUserPayload : CreateUserInput){
    const {password, ...user} = await this.userService.create(createUserPayload)
    return user
  }
}
