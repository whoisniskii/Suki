import { AutocompleteInteraction, ChatInputApplicationCommandData, PermissionResolvable } from 'discord.js';
import { TFunction } from 'i18next';
import { Suki } from '../Suki';
import { CommandContext } from '.';

abstract class Command<Client = Suki> {
  client: Client;
  options: ChatInputApplicationCommandData;
  rawName: string;
  config: {
    registerSlashCommands: boolean;
    devOnly: boolean;
  };

  permissions: {
    bot: PermissionResolvable[];
    user: PermissionResolvable[];
  };

  constructor(client: Client) {
    this.client = client;

    this.rawName = '';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: false,
    };
  }

  execute({ context, t }: CommandExecuteOptions): unknown {
    return { context, t };
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions): unknown {
    return { interaction, value, options };
  }

  addOptions(options: ChatInputApplicationCommandData): void {
    this.options = options;
  }
}

export type CommandExecuteOptions = { context: CommandContext; t: TFunction };
export type AutoCompleteExecuteOptions = { interaction: AutocompleteInteraction; value: string; options?: any };

export { Command };
