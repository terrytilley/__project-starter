import { createConnection } from 'typeorm';

import * as config from '../config/ormconfig';

export const createTypeOrmConnection = async () => {
  return createConnection(config);
};
