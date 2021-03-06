import { PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class PingSubCommand extends Command {
  constructor(client: Suki) {
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

  async execute({ context, t }: CommandExecuteOptions) {
    const dbPing = await this.client.database.getPing();

    context.sendMessage(t('command:suki/ping/success', { clientPing: this.client.ws.ping.toString(), databasePing: dbPing.toString() }));
  }
}
