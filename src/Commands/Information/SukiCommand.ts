import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class SukiCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'suki';
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
      case 'ping': {
        this.client.commands.get('PingSubCommand')?.execute({ context, t });
        break;
      }
    }
  }
}
