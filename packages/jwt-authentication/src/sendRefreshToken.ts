import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
    expires: new Date(Date.now() + 168 * 3600000) // cookie will be removed after 7 days
  });
};
