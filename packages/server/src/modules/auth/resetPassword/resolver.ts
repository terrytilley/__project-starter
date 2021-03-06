import { verify } from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { ResetPasswordInput } from './ResetPasswordInput';

@Resolver()
export default class ResetPasswordResolver {
  @Mutation(() => Boolean)
  async resetPassword(@Arg('input') { userId, token, newPassword }: ResetPasswordInput) {
    const user = await User.findOne({ id: userId });

    if (!user) return false;

    let payload: any = null;
    const secret = `${user.password}-${user.createdAt}`;

    try {
      payload = verify(token, secret);
    } catch (err) {
      console.error(err);

      return false;
    }

    if (payload.userId === user.id) {
      const hashedPassword = await User.hashPassword(newPassword);

      user.locked = false;
      user.password = hashedPassword;
      user.save();

      return true;
    }

    return false;
  }
}
