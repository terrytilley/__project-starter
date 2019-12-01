import { verify } from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { ConfirmEmailInput } from './ConfirmEmailInput';

@Resolver()
export default class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('input') { userId, token }: ConfirmEmailInput) {
    const user = await User.findOne({ id: userId });

    if (!user) return false;
    const secret = `${user.email}-${user.createdAt}`;

    try {
      const payload: any = verify(token, secret);

      if (payload.userId === user.id) {
        user.confirmed = true;
        user.save();

        return true;
      }
    } catch (err) {
      console.error(err);

      return false;
    }

    return false;
  }
}
