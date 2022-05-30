import { PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class TwentyFourHoursCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = '247';
    this.permissions = {
      bot: [],
      user: [PermissionFlagsBits.ManageGuild],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: false,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!context.player) {
      context.reply(t('command:247/error/noPlayer'));
      return;
    }

    const guildDBData = await context.database.getGuild(context.player.guildId);

    if (!guildDBData?.forever) {
      await context.database.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: true } });
      context.reply(t('command:247/on'));
      return;
    }

    await context.database.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: false } });
    context.reply(t('command:247/off'));
    if (!context.player.playing) context.player.disconnect();
  }
}
