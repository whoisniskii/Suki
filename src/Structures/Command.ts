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

  async execute(interaction: CommandInteraction, t: typeof globalThis.t) {
    try {
      this.execute(interaction, t);
    } catch (error: any) {
      interaction.reply(error.message);
    }
  }
}

export interface CommandOptions {
    name: string;
    category?: string;
    data: CommandData
}

export interface CommandData {
    type?: ApplicationCommandType, // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
    guild_id?: Snowflake
    name: string,
    name_localizations?: string // https://discord.com/developers/docs/reference#locales
    description: string;
    description_localizations?: string // https://discord.com/developers/docs/reference#locales
    options?: [{
      type: ApplicationCommandOptionType, // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
      name: string,
      name_localizations?: string
      description: string,
      description_localizations?: string,
      required?: boolean,
      choices?: [],
      options?: [],
      channel_types?: [],
      min_value?: number,
      max_value?: number,
      autocomplete?: boolean
    }],
    default_permission?: boolean
}