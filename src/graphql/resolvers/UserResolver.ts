import { Query, Resolver } from "@nestjs/graphql";
import { User } from "../models/User";

@Resolver()
export class UserResolver{

  @Query((returns) => User)
  getUser(){
    return {
      id: 1,
      email: 'ir@mail.com',
      role: 'admin'
    }
  }
}