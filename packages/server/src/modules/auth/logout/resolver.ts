import { Ctx, Mutation, Resolver } from 'type-graphql';

import { Context } from '../../../types';
import { sendRefreshToken } from '../../../utils/sendRefreshToken';

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');

    return true;
  }
}
