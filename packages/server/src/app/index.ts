import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { limiter } from '../services/rateLimit';
import router from './routes';

export default async function bootstrap(host = 'localhost', port = 4000) {
  const app = express.default();

  app.use(helmet());
  app.use(limiter);

  app.use(
    cors.default({
      origin: process.env.FRONTEND_URL!,
      credentials: true,
    })
  );

  app.use('/', router);

  try {
    const resolvers = [`${__dirname}/../modules/**/**/resolver.ts`];
    const apolloServer = new ApolloServer({
      schema: await buildSchema({ resolvers, validate: true }),
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(port, () => {
      console.log(`🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`);
    });
  } catch (err) {
    console.error('🚨', err);
  }
}
