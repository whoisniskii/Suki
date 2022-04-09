import { readdirSync } from 'fs';
import SukiClient from '../SukiClient';

class CommandManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async execute() {
    console.log('\x1b[32m[COMMANDS]\x1b[0m', 'Commands loaded successfully.');

    this.loadCommands();
  }

  async loadCommands(): Promise<void> {
    const commandFolders = readdirSync('src/Commands');
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`src/Commands/${folder}`);
      for (const file of commandFiles) {
        const commandFile = await import(`../Commands/${folder}/${file}`);
        const command = new commandFile.default(this.client);
        this.client.commands.push(command.name, command);
      }
    }
  }

}

export { CommandManager };