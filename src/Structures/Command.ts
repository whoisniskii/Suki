/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import SukiClient from '../SukiClient';

export default class CommandConstructor {
  client: SukiClient;
  options: Partial<CommandOptions>;
  name: string;
  category?: string;
  data: SlashCommandBuilder;

  constructor(options: CommandOptions, client: SukiClient) {
    this.client = client;
    this.name = options.name,
    this.category = options.category || 'Nenhuma',
    this.data = options.data;
  }

  async execute(interaction: CommandInteraction) {
    try {
      this.execute(interaction);
    } catch (error: any) {
      interaction.reply(error.message);
    }
  }
}

export interface CommandOptions {
    name: string;
    category?: string;
    data: SlashCommandBuilder
}