import { readdirSync } from 'fs';
import SukiClient from '../SukiClient';

class RegisterCommands {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async registerSlashCommands() {
    const commands = [];
    const commandFolders = readdirSync('src/Commands');

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`src/Commands/${folder}`);
      for (const file of commandFiles) {
        const commandFile = await import(`../Commands/${folder}/${file}`);
        const command = new commandFile.default(this.client);
        commands.push(command.data.toJSON());
      }
    }

    this.client.application?.commands.set(commands);
    console.log('\x1b[32m[SLASH]\x1b[0m', 'Updated commands.');
  }
}

export { RegisterCommands };
