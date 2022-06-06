import { Guild } from 'discord.js';
import { Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class GuildDeleteEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildDelete';
  }

  async execute(client: SukiClient, guild: Guild) {
    const guildData = await client.database.getGuildData(guild.id);

    if (!guildData) {
      return;
    }

    await client.database.query('DELETE FROM guilds WHERE guild_id=$1', [guild.id]);
  }
}
