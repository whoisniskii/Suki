import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class PingCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'ping',
      category: 'Information',
      data: {
        name: 'ping',
        description: 'Show\'s the bot ping',
        type: ApplicationCommandType.ChatInput,
        default_permission: true,
        options: []
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction) {
    interaction.reply(`API Ping: **${this.client.ws.ping}ms**`);
  }
}