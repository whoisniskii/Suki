/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, CommandInteraction, CommandInteractionOption, Snowflake } from 'discord.js';
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

  async executeAutoComplete(interaction: AutocompleteInteraction, _value: string, _options?: any) {
    if(interaction instanceof AutocompleteInteraction) {
      if (!interaction.member) return;
      const cmd = this.client.commands.find(c => c.name === interaction.commandName);

      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const options = interaction.options.data as CommandInteractionOption[];

      const focusedField = options.find(o => o.focused);

      cmd.executeAutoComplete?.(interaction, focusedField!.value as string, options);
      return;
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
      choices?: [{
        name: string;
        name_localizations?: string;
        value: string
      }],
      options?: [],
      channel_types?: [],
      min_value?: number,
      max_value?: number,
      autocomplete?: boolean
    }],
    default_permission?: boolean
}