import { readdirSync } from 'fs';
import SukiClient from '../SukiClient';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

class RegisterCommands {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async registerSlashCommands(path: string) {
    const commands = [];
    const commandFolders = readdirSync(path);

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(path + `/${folder}`);
      for (const file of commandFiles) {
        const commandFile = await import(path + `/${folder}/${file}`);
        const command = new commandFile.default(this.client);
        commands.push(command.data);
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    await (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          // If you want to register global commands, change the function `applicationGuildCommands(this.clientId, <guild-id>)` to `applicationCommands(this.clientId)`
          { body: commands },
        );

        console.log('\x1b[32m[SLASH]\x1b[0m', 'Updated commands.');
        process.exit(1);
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

export { RegisterCommands };
