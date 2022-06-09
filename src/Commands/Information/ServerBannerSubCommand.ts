import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class ServerBannerSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'ServerBannerSubCommand';
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
    if (!context.guild) {
      return;
    }

    const bannerUrl = context.guild.bannerURL({ extension: 'png', size: 2048 });

    if (!bannerUrl) {
      context.sendMessage({ content: t('command:server/banner/error/noBanner'), ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setImage(bannerUrl)
      .setTitle(context.guild.name)
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    context.sendMessage({ embeds: [embed] });
  }
}
