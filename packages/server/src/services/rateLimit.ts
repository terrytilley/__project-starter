import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import client from './redis';

export const limiter = RateLimit({
  store: new RedisStore({ client }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
