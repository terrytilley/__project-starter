import { Ctx, Mutation } from 'type-graphql';

import { Context } from '../../../types';
import { sendRefreshToken } from '../../../utils/sendRefreshToken';

export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');

    return true;
  }
}
