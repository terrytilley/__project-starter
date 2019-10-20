import 'dotenv/config';
import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';

import { ApolloServer } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';
import { buildSchema } from 'type-graphql';

import { User } from '../entity/User';
import { UserResolver } from '../graphql/resolvers/User';
import { sendRefreshToken } from '../sendRefreshToken';
import { createAccessToken, createRefreshToken } from '../utils/auth';

export default async () => {
  const port = 4000;
  const app = express.default();

  app.use(
    cors.default({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use('/refresh_token', cookieParser());

  app.post('/refresh_token', async (req, res) => {
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};
