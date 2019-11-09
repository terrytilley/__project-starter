import RateLimit from 'express-rate-limit';
// @ts-ignore
import RedisStore from 'rate-limit-redis';

import client from './redis';

const config = {
  store: new RedisStore({ client }),
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const limiter = new RateLimit(config);

export default limiter;
