import { connect } from 'mongoose';
import GuildDB from '../Database/guildDB';
import UserDB from '../Database/userDB';
import { SukiClient } from '../SukiClient';

class DatabaseManager {
  client: SukiClient;
  userDB: typeof UserDB;
  guildDB: typeof GuildDB;

  constructor(client: SukiClient) {
    this.loaderDatabase();

    this.userDB = UserDB;
    this.guildDB = GuildDB;
    this.client = client;
  }

  async getUser(id: string) {
    const userDBData = await this.client.users.fetch(id);

    if (!userDBData) return null;

    let document = await this.userDB.findOne({ id });

    if (!document) {
      document = new UserDB({
        id,
        locale: 'en-US',
      });
    }

    return document;
  }

  async getAllUsers() {
    const usersDBData = await this.userDB.find({});

    return usersDBData.map(user => user.toJSON());
  }

  async deleteUserSchema(id: string) {
    const userDBData = await this.userDB.findOne({ id });

    if (!userDBData) return;

    userDBData.remove();
  }

  async getGuild(id: string) {
    let document = await this.guildDB.findOne({ guildID: id });

    if (!document) {
      document = new GuildDB({
        guildID: id,
        lang: 'en-US',
        forever: false,
      });
    }

    return document;
  }

  async getAllGuilds() {
    const guildsDBData = await this.guildDB.find({});
    return guildsDBData.map(guild => guild.toJSON());
  }

  async deleteGuildSchema(id: string) {
    const guildDBData = await this.guildDB.findOne({ guildID: id });

    if (!guildDBData) return;

    guildDBData.remove();
  }

  async getUserLocale(id: string) {
    const userDBData = await this.client.users.fetch(id);

    if (!userDBData) return null;

    let document = await this.userDB.findOne({ id });

    if (!document) {
      document = new UserDB({
        _id: id,
        locale: 'en-US',
      });
    }

    return document;
  }

  async getGuildLocale(id: string) {
    const guildDBData = await this.client.guilds.fetch(id);

    if (!guildDBData) return null;

    let document = await this.guildDB.findOne({ id });

    if (!document) {
      document = new GuildDB({
        guildID: id,
        forever: false,
        lang: 'en-US',
      });
    }

    return document;
  }

  loaderDatabase() {
    return connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('\x1b[32m[DATABASE]\x1b[0m', 'Database successfully connected.');
      })
      .catch((err: Error | null) => {
        console.log('\x1b[31m[DATABASE]\x1b[0m', `Error connecting to database.\n${err}`);
      });
  }
}

export { DatabaseManager };
