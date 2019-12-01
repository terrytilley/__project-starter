import { verify } from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { ConfirmEmailInput } from './ConfirmEmailInput';

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('input') { userId, token }: ConfirmEmailInput) {
    const user = await User.findOne({ id: userId });

    if (!user) return false;

    let payload: any = null;
    const secret = `${user.email}-${user.createdAt}`;

    try {
      payload = verify(token, secret);
    } catch (err) {
      console.error(err);

      return false;
    }

    if (payload.userId === user.id) {
      user.confirmed = true;
      user.save();

      return true;
    }

    return false;
  }
}
