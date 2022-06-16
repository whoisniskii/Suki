import type { ClientConfig } from 'pg';

export default {
  interactions: {
    useWebserver: false,
    port: 3000,
    publicKey: 'YOUR PUBLIC KEY',
  },
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
