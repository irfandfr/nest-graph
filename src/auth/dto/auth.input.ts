import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthPayload {
  @Field()
  email: string;

  @Field()
  password: string;
}
