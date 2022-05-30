import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class GuildCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'guild';
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
    }
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions) {
    if (interaction.options.getSubcommand(false) === 'bans') {
      const cmd = this.client.commands.get('BanInfoSubCommand');
      cmd?.executeAutoComplete({ interaction, value, options });
    }
  }
}
