import { AutocompleteInteraction } from 'discord.js';
import { TFunction } from 'i18next';
import { SukiClient } from '../SukiClient';
import { CommandOptions } from '../typings';
import { CommandContext } from '.';

class Command implements CommandOptions {
  client: SukiClient;
  data: CommandOptions;
  name: string;
  description: string;

  constructor(options: CommandOptions, client: SukiClient) {
    this.client = client;
    this.data = options;
    this.name = options.name;
    this.description = options.description;
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
