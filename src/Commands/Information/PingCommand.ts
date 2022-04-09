import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class PingCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'ping',
      category: 'Information',
      data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mostra o ping do bot')
    }, client);
  }

  override async execute(interaction: CommandInteraction) {
    interaction.reply(`API Ping: **${this.client.ws.ping}ms**`);
  }
}