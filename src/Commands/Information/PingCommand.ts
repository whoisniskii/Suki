import { CommandInteraction } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class PingCommand extends CommandConstructor {
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

  override async execute(interaction: CommandInteraction, t: typeof globalThis.t) {
    interaction.reply(t('ping.success', { ping: this.client.ws.ping.toString() }));
  }
}