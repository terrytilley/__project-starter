import app from './app';
import db from './db';

const server = async () => {
  await db();
  app();
};

server();
