import { AutocompleteInteraction, ChatInputApplicationCommandData } from 'discord.js';
import { TFunction } from 'i18next';
import { SukiClient } from '../SukiClient';
import { CommandContext } from '.';

class Command {
  client: SukiClient;
  options: ChatInputApplicationCommandData;
  rawName: string;
  config: {
    guildOnly: boolean;
  };

  constructor(data: ChatInputApplicationCommandData, client: SukiClient) {
    this.client = client;

    this.options = data;
    this.rawName = data.name;
    this.config = {
      guildOnly: true,
    };
  }

  execute({ context, t }: CommandExecuteOptions): unknown {
    return { context, t };
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions): unknown {
    return { interaction, value, options };
  }
}

export type CommandExecuteOptions = { context: CommandContext; t: TFunction };
export type AutoCompleteExecuteOptions = { interaction: AutocompleteInteraction; value: string; options?: any };

export { Command };
