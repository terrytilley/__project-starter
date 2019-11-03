import { Arg, Ctx, Mutation } from 'type-graphql';

import { getConnection } from 'typeorm';
import { User } from '../../entity/User';
import { Context } from '../../types';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import { sendRefreshToken } from '../../utils/sendRefreshToken';
import { LoginResponse } from '../types/LoginResponse';

export class AuthResolver {
  @Mutation(() => User)
  async register(@Arg('email') email: string, @Arg('password') password: string) {
    try {
      return User.create({ email, password }).save();
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Could not find user');
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

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');

    return true;
  }

  // Example of how to revoke refresh tokens
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => String) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }
}
