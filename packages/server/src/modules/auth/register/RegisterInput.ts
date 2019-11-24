import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(20, 30)
  password: string;
}
