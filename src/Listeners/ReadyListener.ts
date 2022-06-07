import { ChatInputApplicationCommandData } from 'discord.js';
import { Event } from '../Structures';
import { Suki } from '../Suki';

export default class ReadyEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'ready';
  }

  async execute(client: Suki) {
    client.logger.info(`Client successfully logged in ${client.user?.tag}.`, 'CLIENT');

    const commands = client.commands.filter(x => x.options && x.config.registerSlashCommands === true).map(x => x.options) as ChatInputApplicationCommandData[];

    await client.application?.commands.set(commands);
    client.logger.info(`Posted ${commands.length} commands to Discord!`, 'COMMANDS');
  }
}
