import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private userService: UsersService){
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    })
  }

  async validate(payload: {id: number, email: string, role?: string}){
    return {userId: payload.id, email: payload.email, role: payload.role}
  }
}