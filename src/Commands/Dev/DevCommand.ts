import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class DevCommand extends Command {
  constructor(client: Suki) {
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
        this.client.commands.get('EvalSubCommand')?.execute({ context, t });
        break;
      }

      case 'shell': {
        this.client.commands.get('ShellSubCommand')?.execute({ context, t });
        break;
      }
    }
  }
}
