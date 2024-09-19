import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field({ description: `Task's title` })
  title: string;

  @Field({description: `Task's description`})
  description: string

  @Field(() => Int,{description: `Another tasks's ID to add to the current tasks dependency`, nullable: true})
  dependency: number
}
