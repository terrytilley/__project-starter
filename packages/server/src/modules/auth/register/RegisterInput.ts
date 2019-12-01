import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { User } from '../../../entity/User';
import { IsEmailAlreadyExist } from './isEmailAlreadyExist';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'email already in use' })
  email: string;

  @Field()
  @Length(8, 30)
  password: string;
}
