/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdirSync } from 'fs';
import SukiClient from '../SukiClient';

class RegisterCommands {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async registerGlobalCommands(path: string) {
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

  async registerLocalCommands(path: string) {
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

    await (async () => {
      try {
        await this.client.requestHandler.request('PUT', `/applications/${this.client.user.id}/guilds/${process.env.GUILD_ID}/commands`, true, commands as any);

        console.log('\x1b[32m[SLASH]\x1b[0m', `Updated slash commands in guild ${process.env.GUILD_ID}.`);
        process.exit(1);
      } catch (error) {
        console.error(error);
      }
    })();
  }

  async editGlobalCommand() {
    const command = this.client.commands.find(x => x.name === 'ping');

    await (async () => {
      try {
        await this.client.requestHandler.request('PATCH', `/applications/${this.client.user.id}/commands/964706281464143915`, true, command?.data as any);

        console.log('\x1b[32m[SLASH]\x1b[0m', 'Command updated.');
        process.exit(1);
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

export { RegisterCommands };
