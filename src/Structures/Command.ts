import { AutocompleteInteraction, Awaitable, ChatInputApplicationCommandData } from 'discord.js';
import { TFunction } from 'i18next';
import { SukiClient } from '../SukiClient';
import { CommandContext } from '.';

class Command {
  client: SukiClient;
  options: ChatInputApplicationCommandData;
  rawName: string;
  config: {
    ephemeral: boolean;
    autoDefer: boolean;
    guildOnly: boolean;
  };

  constructor(data: ChatInputApplicationCommandData, client: SukiClient) {
    this.client = client;

    this.options = data;
    this.rawName = data.name;
    this.config = {
      ephemeral: false,
      autoDefer: true,
      guildOnly: true,
    };
  }

  execute({ context, t }: CommandExecuteOptions): Awaitable<any> {
    return { context, t };
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions): Awaitable<any> {
    return { interaction, value, options };
  }
}

export type CommandExecuteOptions = { context: CommandContext; t: TFunction };
export type AutoCompleteExecuteOptions = { interaction: AutocompleteInteraction; value: string; options?: any };

export { Command };
