import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
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
        commands.push(command.data);
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN as string);

    await (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID as string),
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
