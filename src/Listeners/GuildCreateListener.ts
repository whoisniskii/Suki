import { Guild } from 'discord.js';
import { Event } from '../Structures';
import { Suki } from '../Suki';

export default class GuildCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'guildCreate';
  }

  async execute(client: Suki, guild: Guild) {
    await client.database.createGuild(guild.id);
  }
}
