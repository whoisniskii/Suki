import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class UserInfoSubCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'UserInfoSubCommand';
    this.permissions = {
      bot: [],
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
      context.reply({ content: t('command:user/banner/error/noUser'), ephemeral: true });
      return;
    }

    if (!user.banner) {
      context.reply({ content: t('command:user/banner/error/noBanner'), ephemeral: true });
      return;
    }

    let extension = 'png';

    if (user.banner.startsWith('a_')) extension = 'gif';

    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${extension}?size=512`;

    const embed = new EmbedBuilder().setColor('Purple').setTitle(`🖼️ ${user.username}`).setImage(bannerUrl);

    const row = new ActionRowBuilder<ButtonBuilder>({ components: [new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(bannerUrl).setLabel(t('command:user/banner/button/label'))] });

    context.reply({ embeds: [embed], components: [row] });
  }
}
