import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class BotCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'bot';
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
        this.client.commands.get('BotPingSubCommand')?.execute({ context, t });
        break;
      }
    }
  }
}
