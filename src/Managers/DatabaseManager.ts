import { connect } from 'mongoose';
import SukiClient from '../SukiClient';

class DatabaseManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async execute() {
    this.loaderDatabase().then(() =>
      console.log(
        '\x1b[32m[DATABASE]\x1b[0m',
        'Database successfully connected.'
      )
    );
  }

  loaderDatabase() {
    return connect(process.env.MONGODB_URI).catch((err) => {
      console.log(
        '\x1b[31m[DATABASE]\x1b[0m',
        `Error connecting to database.\n${err}`
      );
    });
  }
}

export { DatabaseManager };