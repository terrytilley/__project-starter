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

export const confirmEmailTemplate = ({ email }: User, url: string) => ({
  from: 'info@project-starter.com',
  to: email,
  subject: 'Confirm Email',
  html: `
    <p>Please follow the link to confirm your email address:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 24 hours, it will expire.</p>
  `,
});
