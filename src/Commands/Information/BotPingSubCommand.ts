import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class BotPingSubCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'ping';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: false,
      devOnly: false,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    context.reply(t('command:bot/ping/success', { ping: this.client.ws.ping.toString() }));
  }
}
