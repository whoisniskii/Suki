import { AutocompleteInteraction, ChatInputApplicationCommandData, CommandInteractionOptionResolver, PermissionResolvable } from 'discord.js';
import { TFunction } from 'i18next';
import { SukiClient } from '../SukiClient';
import { CommandContext } from '.';

abstract class Command<Client = SukiClient> {
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

  constructor(client: Client, data?: ChatInputApplicationCommandData) {
    this.client = client;

    this.options = (data as ChatInputApplicationCommandData) ?? '';
    this.rawName = data?.name ?? '';
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
}

export type CommandExecuteOptions = { context: CommandContext; t: TFunction };
export type AutoCompleteExecuteOptions = { interaction: AutocompleteInteraction; value: string; options?: Omit<CommandInteractionOptionResolver<any>, 'getMessage'> };

export { Command };
