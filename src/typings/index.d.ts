import { AutocompleteInteraction, InteractionDataOptionWithValue } from "eris";
import { TFunction } from "i18next";
import CommandContext from '../Structures';

interface CommandOptions {
  type?: number, // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
  name: string,
  name_localizations?: { } // https://discord.com/developers/docs/reference#locales
  description: string;
  description_localizations?: { } // https://discord.com/developers/docs/reference#locales
  options?: Array<{
    type: number, // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
    name: string,
    name_localizations?: { }
    description: string,
    description_localizations?: { },
    required?: boolean,
    choices?: [{
      name: string;
      name_localizations?: string;
      value: string
    }],
    channel_types?: [],
    min_value?: number,
    max_value?: number,
    autocomplete?: boolean,
  }>,
  default_permission?: boolean
}

interface Command extends CommandOptions {
  execute: (interaction: CommandContext, t: TFunction) => void;
  executeAutoComplete: (interaction: AutocompleteInteraction, value: string, options?: InteractionDataOptionWithValue[]) => void;
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