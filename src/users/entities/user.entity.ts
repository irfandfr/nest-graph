import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
@ObjectType()
export class User{

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string

  @Column({type: 'text', default: "user"})
  @Field({nullable: true})
  role: string
}