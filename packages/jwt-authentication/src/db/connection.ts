import { createConnection } from 'typeorm';

export const createTypeOrmConnection = async () => {
  return createConnection();
};
