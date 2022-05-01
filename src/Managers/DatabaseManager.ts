import { connect } from 'mongoose';
import SukiClient from '../SukiClient';
import guildDB from '../Database/guildDB';
import userDB from '../Database/userDB';

class DatabaseManager {
  client: SukiClient;
  user: typeof userDB;
  guild: typeof guildDB;

  constructor(client: SukiClient) {
    this.loaderDatabase();

    this.user = userDB;
    this.guild = guildDB;
    this.client = client;
  }

  async getUser(id: string) {
    const userDBData = await this.client.users.get(id);

    if (!userDBData) return null;

    let document = await this.user.findOne({ id: id });

    if(!document) {
      document = new this.user({
        id: id,
        locale: 'en-US'
      });
    }

    return document;
  }

  async getAllUsers() {
    const usersDBData = await this.user.find({});

    return usersDBData.map(user => user.toJSON());
  }

  async deleteUserSchema(id: string) {
    const userDBData = await this.user.findOne({ id: id });

    if(!userDBData) return;

    return userDBData.remove();
  }

  async getGuild(id: string) {
    let document = await this.guild.findOne({ guildID: id });

    if (!document) {
      document = new this.guild({
        guildID: id,
        lang: 'en-US',
        forever: false
      });
    }

    return document;
  }

  async getAllGuilds() {
    const guildsDBData = await this.guild.find({});
    return guildsDBData.map(guild => guild.toJSON());
  }

  async deleteGuildSchema(id: string) {
    const guildDBData = await this.guild.findOne({ guildID: id });

    if(!guildDBData) return;

    return guildDBData.remove();
  }

  async getUserLocale(id: string) {
    const userDBData = await this.client.users.get(id);

    if (!userDBData) return null;

    let document = await this.user.findOne({ id: id });

    if (!document) {
      document = new this.user({
        _id: id,
        locale: 'en-US'
      });
    }

    return document;
  }

  async getGuildLocale(id: string) {
    const guildDBData = await this.client.guilds.get(id);

    if (!guildDBData) return null;

    let document = await this.guild.findOne({ id: id });

    if (!document) {
      document = new this.guild({
        guildID: id,
        lang: 'en-US',
        forever: false
      });
    }

    return document;
  }

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