import { ApplicationCommandType, Snowflake, ApplicationCommandOptionType, CommandInteraction, AutocompleteInteraction } from "discord.js";

interface CommandData {
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

interface CommandOptions {
  name: string;
  category?: string;
  data: CommandData;
}

interface Command extends CommandOptions {
  execute: (interaction: CommandInteraction, t: typeof globalThis.t) => void;
  executeAutoComplete: (interaction: AutocompleteInteraction, value: string, options?: any) => void;
}

interface Choices {
  name: string;
  value: string;
}

import 'vulkava';

declare module 'vulkava' {
    export interface Player {
      lastPlayingMsgID?: string;
      reconnect?: boolean;
    }
  }