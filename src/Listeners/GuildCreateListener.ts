import { Guild } from 'discord.js';
import { GuildInterface } from '../Managers';
import { Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class GuildCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildCreate';
  }

  async execute(client: SukiClient, guild: Guild) {
    const guildData: GuildInterface = {
      guild_id: guild.id,
      guild_data: {
        forever: false,
      },
      created_at: new Date(),
    };

    await client.database.query(`INSERT INTO guilds (guild_id, guild_data, created_at) VALUES ($1, $2, $3)`, [guildData.guild_id, guildData.guild_data, guildData.created_at]);
  }
}
