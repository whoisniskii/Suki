/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteInteraction, InteractionDataOptionWithValue } from 'eris';
import { TFunction } from 'i18next';
import { CommandContext } from '.';
import { SukiClient } from '../SukiClient';
import { CommandOptions } from '../typings';

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

  execute({ context, t }: CommandExecuteOptions): any {
    return { context, t };
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions): any {
    return { interaction, value, options };
  }
}

export type CommandExecuteOptions = { context: CommandContext; t: TFunction };
export type AutoCompleteExecuteOptions = { interaction: AutocompleteInteraction; value: string; options?: InteractionDataOptionWithValue[] };

export { Command };
