import cookieParser from 'cookie-parser';
import * as express from 'express';
import { verify } from 'jsonwebtoken';

import { User } from '../../entity/User';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import { sendRefreshToken } from '../../utils/sendRefreshToken';

const router = express.Router();

router.post('/refresh_token', cookieParser(), async (req, res) => {
  const token = req.cookies.jid;

  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.error(err);

    return res.send({ ok: false, accessToken: '' });
  }

  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

export default router;
