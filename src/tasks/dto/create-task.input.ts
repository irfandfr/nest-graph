import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field({ description: `Task's title` })
  title: string;

  @Field({description: `Task's description`})
  description: string

  @Field(() => Int,{description: `Task's dependency`, nullable: true})
  dependency: number
}
