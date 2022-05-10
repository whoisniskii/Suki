import { Guild } from 'discord.js';
import { SukiClient } from '../SukiClient';
import { Event } from '../Structures';

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
