import { ChatInputApplicationCommandData } from 'discord.js';
import { Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class ReadyEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'ready';
  }

  async execute(client: SukiClient) {
    client.logger.info(`Client successfully logged in ${client.user?.tag}.`, 'CLIENT');

    client.connectLavaLink();
    const commands = client.commands.filter(x => x.options).map(x => x.options) as ChatInputApplicationCommandData[];

    await client.application?.commands.set(commands);
    // (await client.guilds.fetch(client.config.client.guild)).commands.set(commands);
    client.logger.info(`Posted ${commands.length} commands to Discord!`, 'COMMANDS');

    // if (client.user?.id === process.env.CLIENT_TEST_ID) {
    //   client.rest.on('response', (req, response) => client.logger.info(`${req.method} ${req.path}, ${response.statusCode}: (${client.ws.ping}ms avg)`, 'REQUEST'));
    // }
  }
}
