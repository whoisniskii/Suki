import { Guild } from 'discord.js';
import { SukiClient } from '../SukiClient';

export default class GuildCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'guildCreate';
  }

  async execute(guild: Guild) {
    await this.client.database.deleteGuildSchema(guild.id);
  }
}
