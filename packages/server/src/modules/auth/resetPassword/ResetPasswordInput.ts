import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  userId: string;

  @Field()
  token: string;

  @Field()
  @Length(8, 30)
  newPassword: string;
}
