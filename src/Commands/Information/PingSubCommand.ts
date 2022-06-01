import { PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class SukiPingSubCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'PingSubCommand';
    this.permissions = {
      bot: [PermissionFlagsBits.EmbedLinks],
      user: [],
    };
    this.config = {
      registerSlashCommands: false,
      devOnly: false,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    context.reply(t('command:suki/ping/success', { ping: this.client.ws.ping.toString() }));
  }
}
