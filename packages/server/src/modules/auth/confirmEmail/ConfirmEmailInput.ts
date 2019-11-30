import { Field, InputType } from 'type-graphql';

@InputType()
export class ConfirmEmailInput {
  @Field()
  userId: string;

  @Field()
  token: string;
}
