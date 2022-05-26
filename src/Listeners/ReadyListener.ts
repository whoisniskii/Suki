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
    console.log('\x1b[32m[CLIENT]\x1b[0m', `Client successfully logged in ${client.user?.tag}.`);

    client.connectLavaLink();
    const commands = client.commands.filter(x => x.options).map(x => x.options) as ChatInputApplicationCommandData[];

    await client.application?.commands.set(commands);
    console.log('\x1b[32m[COMMANDS]\x1b[0m', `Posted ${commands.length} commands to Discord!`);

    // if (client.user?.id === process.env.CLIENT_TEST_ID) {
    //   client.rest.on('response', (req, response) => console.log('\x1b[32m[REQUEST]\x1b[0m', `${req.method} ${req.path}, ${response.statusCode}: (${client.ws.ping}ms avg)`));
    // }
  }
}
