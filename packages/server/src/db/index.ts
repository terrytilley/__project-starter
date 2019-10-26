import { createTypeOrmConnection } from './connection';

export default async (retries = 5) => {
  while (retries) {
    try {
      const connection = await createTypeOrmConnection();
      await connection.runMigrations();
      break;
    } catch (err) {
      retries -= 1;
      console.error(err);
      console.log(`Retries left: ${retries}`);
      // wait 5 seconds
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
