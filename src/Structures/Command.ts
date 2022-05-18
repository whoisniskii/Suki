import { AutocompleteInteraction, ChatInputApplicationCommandData, PermissionResolvable } from 'discord.js';
import { TFunction } from 'i18next';
import { SukiClient } from '../SukiClient';
import { CommandContext } from '.';

abstract class Command<Client = SukiClient> {
  client: Client;
  options: ChatInputApplicationCommandData;
  rawName: string;
  permissions: {
    bot: PermissionResolvable[];
    user: PermissionResolvable[];
  };

  constructor(data: ChatInputApplicationCommandData, client: Client) {
    this.client = client;

    this.options = data;
    this.rawName = data.name;
    this.permissions = {
      bot: [],
      user: [],
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
