import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { confirmEmailToken, confirmEmailUrl } from '../../../utils/auth';
import { confirmEmailTemplate } from '../../../utils/emailTemplates';
import { sendEmail } from '../../../utils/emailTransporter';
import { RegisterInput } from './RegisterInput';

@Resolver(() => User)
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('input') { email, password }: RegisterInput): Promise<User> {
    try {
      const user = await User.create({ email, password }).save();
      const token = confirmEmailToken(user);
      const url = confirmEmailUrl(user, token);
      const emailTemplate = confirmEmailTemplate(user, url);

      await sendEmail(emailTemplate);

      return user;
    } catch (err) {
      console.error(err);

      return err;
    }
  }
}
