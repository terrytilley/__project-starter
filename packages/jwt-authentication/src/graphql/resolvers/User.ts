import { compare, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';

import { User } from '../../entity/User';
import { isAuth } from '../../middleware/isAuth';
import { sendRefreshToken } from '../../sendRefreshToken';
import { Context } from '../../types';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import { LoginResponse } from '../types/LoginResponse';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

      return User.findOne(payload.userId);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  // Example of auth middleware in use
  @Query(() => String)
  @UseMiddleware(isAuth)
  protected(@Ctx() { payload }: Context) {
    return `userId: ${payload!.userId}`;
  }

  @Mutation(() => Boolean)
  async register(@Arg('email') email: string, @Arg('password') password: string) {
    const salt = 12;
    const hashedPassword = await hash(password, salt);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.error(err);

      return false;
    }

    return true;
  }

  // Example of how to revoke refresh tokens
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');

    return true;
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

    const valid = await compare(password, user.password);

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
