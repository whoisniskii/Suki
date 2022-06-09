import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class ServerCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'server';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: false,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    switch (context.options.getSubcommand()) {
      case 'bans': {
        this.client.commands.get('BanInfoSubCommand')?.execute({ context, t });
        break;
      }

      case 'icon': {
        this.client.commands.get('ServerIconSubCommand')?.execute({ context, t });
        break;
      }

      case 'banner': {
        this.client.commands.get('ServerBannerSubCommand')?.execute({ context, t });
        break;
      }

      case 'splash': {
        this.client.commands.get('ServerSplashSubCommand')?.execute({ context, t });
        break;
      }
    }
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions) {
    if (interaction.options.getSubcommand(false) === 'bans') {
      const cmd = this.client.commands.get('BanInfoSubCommand');
      cmd?.executeAutoComplete({ interaction, value, options });
    }
  }
}
