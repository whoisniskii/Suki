import { CommandInteraction } from 'discord.js';
import Command from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'ping',
      category: 'Information',
      data: {
        name: 'ping',
        description: 'mostra o ping do bot',
      }
    }, client);
  }

  async execute(interaction: CommandInteraction, t: typeof globalThis.t): Promise<void> {
    interaction.reply(t('ping.success', { ping: this.client.ws.ping.toString() }));
  }
}