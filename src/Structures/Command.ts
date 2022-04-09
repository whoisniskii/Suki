/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction, Snowflake } from 'discord.js';
import SukiClient from '../SukiClient';

export default class CommandConstructor {
  client: SukiClient;
  options: Partial<CommandOptions>;
  name: string;
  category?: string;
  data: { };

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
    data: {
      name: string,
      type?: ApplicationCommandType,
      description: string;
      guild_id?: Snowflake
      description_localizations?: string // https://discord.com/developers/docs/reference#locales
      options: [
        name?: string,
        description?: string,
        type?: ApplicationCommandOptionType
      ],
      default_permission?: boolean
    }
}