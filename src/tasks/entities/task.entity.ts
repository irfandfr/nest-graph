import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'tasks'})
@ObjectType()
export class Task{
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column('text')
  @Field()
  title: string;

  @Column('text')
  @Field()
  description: string;

  @Column({type: 'text', default: "open"})
  @Field()
  status: 'open' | 'in-progress' | 'done';

  @OneToOne(() => Task)
  @JoinColumn()
  @Field(() => Task,{nullable:true})
  taskDependency? : Task

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  @Field(() => Date)
  updatedAt: Date;
}