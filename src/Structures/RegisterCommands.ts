/* eslint-disable new-cap */
/* eslint-disable no-await-in-loop */
import { readdirSync } from 'fs';
import { SukiClient } from '../SukiClient';

class RegisterCommands {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
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

    await (async () => {
      try {
        await this.client.requestHandler.request('PUT', `/applications/${this.client.user.id}/commands`, true, commands as any);

        console.log('\x1b[32m[SLASH]\x1b[0m', 'Updated global slash commands.');
        process.exit(1);
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

export { RegisterCommands };
