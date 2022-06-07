import { Guild } from 'discord.js';
import { Event } from '../Structures';
import { Suki } from '../Suki';

export default class GuildDeleteEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildDelete';
  }

  async execute(client: Suki, guild: Guild) {
    await client.database.deleteGuildData(guild.id);
  }
}
