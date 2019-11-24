import { ConfirmEmailResolver } from './auth/confirmEmail/resolver';
import { ForgotPasswordResolver } from './auth/forgotPassword/resolver';
import { LoginResolver } from './auth/login/resolver';
import { LogoutResolver } from './auth/logout/resolver';
import { RegisterResolver } from './auth/register/resolver';
import { ResetPasswordResolver } from './auth/resetPassword/resolver';

import { UserResolver } from './user';

export const resolvers = [
  // Auth Resolvers
  ConfirmEmailResolver,
  ForgotPasswordResolver,
  LoginResolver,
  LogoutResolver,
  RegisterResolver,
  ResetPasswordResolver,
  // User Resolvers
  UserResolver,
];
