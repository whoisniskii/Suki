import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class UserAvatarSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'UserAvatarSubCommand';
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
      context.sendMessage({ content: t('command:user/avatar/error/noUser'), ephemeral: true });
    }

    if (!user.avatar) {
      context.sendMessage({ content: t('command:user/avatar/error/noUserAvatar'), ephemeral: true });
    }

    const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512 });

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setTitle(user.username)
      .setImage(avatarUrl)
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>({ components: [new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(avatarUrl).setLabel(t('command:user/avatar/button/label'))] });

    context.sendMessage({ embeds: [embed], components: [row] });
  }
}
