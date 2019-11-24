import { verify } from 'jsonwebtoken';
import { Arg, Mutation } from 'type-graphql';

import { User } from '../../../entity/User';

export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(
    @Arg('token', () => String) token: string,
    @Arg('userId', () => String) userId: string
  ) {
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
