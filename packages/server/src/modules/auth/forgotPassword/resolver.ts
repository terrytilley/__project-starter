import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../entity/User';
import { passwordResetToken, passwordResetUrl } from '../../../utils/auth';
import { resetPasswordTemplate } from '../../../utils/emailTemplates';
import { sendEmail } from '../../../utils/emailTransporter';
import { ForgotPasswordInput } from './ForgotPasswordInput';

@Resolver()
export default class ForgotPasswordResolver {
  @Mutation(() => String)
  async forgotPassword(@Arg('input') { email }: ForgotPasswordInput) {
    const user = await User.findOne({ email });
    const response = `A password reset email has been sent to ${email}`;

    if (!user) return response;

    const token = passwordResetToken(user);
    const url = passwordResetUrl(user, token);
    const emailTemplate = resetPasswordTemplate(user, url);

    try {
      await sendEmail(emailTemplate);
    } catch (err) {
      console.error(err);

      return err;
    }

    user.locked = true;
    user.tokenVersion += 1;
    user.save();

    return response;
  }
}
