import { verify } from 'jsonwebtoken';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { User } from '../../entity/User';
import { isAuth } from '../../middleware/isAuth';
import { Context } from '../../types';

@Resolver()
export default class UserResolver {
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
}
