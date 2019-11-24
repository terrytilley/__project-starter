import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { resolvers } from '../modules/resolvers';
import limiter from '../services/rateLimit';
import router from './routes';

export default async (host = 'localhost', port = 4000) => {
  const app = express.default();

  app.use(helmet());

  app.use(
    cors.default({
      origin: process.env.FRONTEND_URL!,
      credentials: true,
    })
  );

  app.use('/', router);

  if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`);
  });
};
