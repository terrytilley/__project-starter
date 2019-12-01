import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { User } from '../../../entity/User';

@InputType()
export class ForgotPasswordInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;
}
