import { Guild } from 'discord.js';
import { Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class GuildCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildCreate';
  }

  async execute(client: SukiClient, guild: Guild) {
    await client.database.getGuild(guild.id);
  }
}
