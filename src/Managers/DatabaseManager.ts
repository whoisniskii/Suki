import { connect } from 'mongoose';

class DatabaseManager {

  loaderDatabase() {
    return connect(process.env.MONGODB_URI).then(() => {
      console.log(
        '\x1b[32m[DATABASE]\x1b[0m',
        'Database successfully connected.'
      );
    }).catch((err: Error | null) => {
      console.log(
        '\x1b[31m[DATABASE]\x1b[0m',
        `Error connecting to database.\n${err}`
      );
    });
  }

}

export { DatabaseManager };