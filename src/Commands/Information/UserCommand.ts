import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class UserCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'user';
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
      case 'info': {
        this.client.commands.get('UserInfoSubCommand')?.execute({ context, t });
        break;
      }
    }
  }
}
