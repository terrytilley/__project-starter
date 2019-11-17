import { User } from '../entity/User';

export const resetPasswordTemplate = ({ email }: User, url: string) => ({
  from: 'info@project-starter.com',
  to: email,
  subject: 'Password Reset',
  html: `
    <p>Please follow the link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 1 hour, it will expire.</p>
  `,
});
