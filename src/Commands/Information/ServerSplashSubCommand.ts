import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class ServerSplashSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'ServerSplashSubCommand';
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

    const splashUrl = context.guild.splashURL({ extension: 'png', size: 2048 });

    if (!splashUrl) {
      context.sendMessage({ content: t('command:server/splash/error/noSplash'), ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setImage(splashUrl)
      .setTitle(context.guild.name)
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    context.sendMessage({ embeds: [embed] });
  }
}
