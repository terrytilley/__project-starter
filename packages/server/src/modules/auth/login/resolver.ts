import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { Context } from '../../../types';
import { createAccessToken, createRefreshToken } from '../../../utils/auth';
import { sendRefreshToken } from '../../../utils/sendRefreshToken';
import { LoginInput } from './LoginInput';
import { LoginResponse } from './LoginResponse';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Could not find user');
    }

    if (!user.confirmed) {
      throw new Error('Confirm your email address');
    }

    if (user.locked) {
      throw new Error('Account is locked');
    }

    const valid = await User.comparePassword(user, password);

    if (!valid) {
      throw new Error('Bad password');
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user,
      accessToken: createAccessToken(user),
    };
  }
}
