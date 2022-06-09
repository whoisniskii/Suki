import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class UserBannerSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'UserBannerSubCommand';
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
    const user = await (context.options.getUser('user') ?? context.user).fetch();
    if (!user) {
      context.sendMessage({ content: t('command:user/banner/error/noUser'), ephemeral: true });
      return;
    }

    if (!user.banner) {
      context.sendMessage({ content: t('command:user/banner/error/noBanner'), ephemeral: true });
      return;
    }

    let extension = 'png';

    if (user.banner.startsWith('a_')) extension = 'gif';

    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${extension}?size=512`;

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setTitle(user.username)
      .setImage(bannerUrl)
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>({ components: [new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(bannerUrl).setLabel(t('command:user/banner/button/label'))] });

    context.sendMessage({ embeds: [embed], components: [row] });
  }
}
