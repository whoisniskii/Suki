import { connect } from 'mongoose';
import GuildDB from '../Database/guildDB';
import UserDB from '../Database/userDB';
import { SukiClient } from '../SukiClient';

class DatabaseManager {
  client: SukiClient;
  userDB: typeof UserDB;
  guildDB: typeof GuildDB;

  constructor(client: SukiClient) {
    this.client = client;
    this.userDB = UserDB;
    this.guildDB = GuildDB;

    this.loadDatabase();
  }

  async getUser(userId: string) {
    const userDBData = await this.client.users.fetch(userId);

    if (!userDBData) return null;

    let document = await this.userDB.findOne({ userId });

    if (!document) {
      document = new UserDB({ userId });
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

  async getGuild(guildId: string) {
    let document = await this.guildDB.findOne({ guildID: guildId });

    if (!document) {
      document = new GuildDB({
        guildID: guildId,
        forever: false,
      });
    }

    return document;
  }

  async getAllGuilds() {
    const guildsDBData = await this.guildDB.find({});
    return guildsDBData.map(guild => guild.toJSON());
  }

  async deleteGuildSchema(guildId: string) {
    const guildDBData = await this.guildDB.findOne({ guildID: guildId });

    if (!guildDBData) return;

    guildDBData.remove();
  }

  loadDatabase() {
    return connect(this.client.config.database.mongodb)
      .then(() => {
        console.log('\x1b[32m[DATABASE]\x1b[0m', 'Database successfully connected.');
      })
      .catch((err: Error | null) => {
        console.log('\x1b[31m[DATABASE]\x1b[0m', `Error connecting to database.\n${err}`);
      });
  }
}

export { DatabaseManager };
