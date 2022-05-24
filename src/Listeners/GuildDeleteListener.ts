import { Guild } from 'discord.js';
import { Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class GuildDeleteEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildDelete';
  }

  execute(client: SukiClient, guild: Guild) {
    client.database.deleteGuildSchema(guild.id);
  }
}
