import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation } from 'type-graphql';

import { User } from '../../entity/User';
import { Context } from '../../types';
import {
  createAccessToken,
  createRefreshToken,
  passwordResetToken,
  passwordResetUrl,
} from '../../utils/auth';
import { resetPasswordTemplate } from '../../utils/emailTemplates';
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

  @Mutation(() => String)
  async forgotPassword(@Arg('email', () => String) email: string) {
    const user = await User.findOne({ email });
    const response = `A password reset email has been sent to ${email}`;

    if (!user) return response;

    const token = passwordResetToken(user);
    const url = passwordResetUrl(user, token);
    const emailTemplate = resetPasswordTemplate(user, url);

    // Send email
    console.log({ emailTemplate });

    user.locked = true;
    user.tokenVersion += 1;
    user.save();

    return response;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('token', () => String) token: string,
    @Arg('userId', () => String) userId: string,
    @Arg('newPassword', () => String) newPassword: string
  ) {
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
