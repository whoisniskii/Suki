import type { ClientConfig } from 'pg';

export default {
  client: {
    token: 'BOT TOKEN',
  },
  databaseConfig: {
    user: 'POSTGRESQL USER',
    host: 'POSTGRESQL HOST',
    database: 'POSTGRESQL DATABASE',
    password: 'POSTGRESQL PASSWORD',
    port: 2333,
  } as ClientConfig,
};
