import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    // domain: '.example.com',
    // path: "/refresh_token", // Set path if not server sider rendering
    expires: new Date(Date.now() + 168 * 3600000) // cookie will be removed after 7 days
  });
};
