import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class ServerIconSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'ServerIconSubCommand';
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

    const iconUrl = context.guild.iconURL({ extension: 'png', size: 2048 });

    if (!iconUrl) {
      context.sendMessage({ content: t('command:server/icon/error/noIcon'), ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setImage(iconUrl)
      .setTitle(context.guild.name)
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    context.sendMessage({ embeds: [embed] });
  }
}
