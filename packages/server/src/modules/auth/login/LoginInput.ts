import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { User } from '../../../entity/User';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 30)
  password: string;
}
