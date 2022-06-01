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
      context.reply({ content: t('command:user/avatar/error/noUser'), ephemeral: true });
    }

    if (!user.avatar) {
      context.reply({ content: t('command:user/avatar/error/noUserAvatar'), ephemeral: true });
    }

    let extension = 'png';

    if (user.avatar?.startsWith('a_')) extension = 'gif';

    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=512`;

    const embed = new EmbedBuilder().setColor('Purple').setTitle(`🖼️ ${user.username}`).setImage(avatarUrl);

    const row = new ActionRowBuilder<ButtonBuilder>({ components: [new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(avatarUrl).setLabel(t('command:user/avatar/button/label'))] });

    context.reply({ embeds: [embed], components: [row] });
  }
}
