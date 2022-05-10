/* eslint-disable new-cap */
/* eslint-disable no-await-in-loop */
import { readdirSync } from 'fs';
import { SukiClient } from '../SukiClient';

export default class Ready {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'ready';
  }

  async execute() {
    console.log('\x1b[32m[CLIENT]\x1b[0m', `Client successfully logged in ${this.client.user?.username}#${this.client.user?.discriminator}.`);

    this.client.connectLavaLink();
    await this.registerSlashCommands(`${__dirname}/../Commands`);
  }

  async registerSlashCommands(path: string) {
    const commands = [];
    const commandFolders = readdirSync(path);

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`${path}/${folder}`);
      for (const file of commandFiles) {
        const commandFile = await import(`${path}/${folder}/${file}`);
        const command = new commandFile.default(this.client);
        commands.push(command.data);
      }
    }

    await this.client.application?.commands.set(commands);
  }
}
