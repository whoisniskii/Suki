/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
import { readdirSync } from 'fs';
import { SukiClient } from '../SukiClient';

class CommandManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async loadCommands(path: string): Promise<void> {
    const commandFolders = readdirSync(path);
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`${path}/${folder}`);
      for (const file of commandFiles) {
        const commandFile = await import(`${path}/../Commands/${folder}/${file}`);
        const command = new commandFile.default(this.client);
        this.client.commands.push(command.rawName, command);
      }
    }

    console.log('\x1b[32m[COMMANDS]\x1b[0m', 'Commands loaded successfully.');
  }
}

export { CommandManager };
