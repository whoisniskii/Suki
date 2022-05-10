import { Guild } from 'discord.js';
import { SukiClient } from '../SukiClient';
import { Event } from '../Structures';

export default class GuildDeleteEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guilDelete';
  }

  async execute(client: SukiClient, guild: Guild) {
    await client.database.deleteGuildSchema(guild.id);
  }
}
