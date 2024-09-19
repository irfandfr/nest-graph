import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //returns if resolver is public 
    return isPublic ? true : super.canActivate(context)
  }

  handleRequest(err: any, user: {userId: string, email: string, role: string}, info: any, context: ExecutionContext) {
    // Handle errors, user, and info here
    let validRole = true 

    // check for roles
    const roles = this.reflector.get<string[]>('roles', context.getHandler()) || [];

    if(roles.length > 0 && !roles.includes(user.role)){
      // if there are roles and user's role is not on the list
      validRole = false
    }

    if (err) {
      return err;
    }else if( !user || !validRole){
      // throw error if unaauthorized method
      throw new UnauthorizedException()
    }
  }
}
