import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class DevCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'dev';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: true,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    switch (context.options.getSubcommand()) {
      case 'eval': {
        this.client.commands.get('DevEvalSubCommand')?.execute({ context, t });
        break;
      }

      case 'shell': {
        this.client.commands.get('DevShellSubCommand')?.execute({ context, t });
        break;
      }
    }
  }
}
