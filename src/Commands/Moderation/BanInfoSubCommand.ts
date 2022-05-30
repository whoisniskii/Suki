import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import i18next from 'i18next';
import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class BanInfoSubCommand extends Command {
  constructor(client: SukiClient) {
    super(client);
    this.rawName = 'BanInfoSubCommand';
    this.config = {
      registerSlashCommands: false,
    };
    this.permissions = {
      bot: [PermissionFlagsBits.BanMembers],
      user: [PermissionFlagsBits.BanMembers],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const str = context.options.getString('user', true);

    if (str === 'none') {
      context.reply({ content: t('command:guild/ban/error/noUser'), ephemeral: true });
      return;
    }

    const ban = await context.guild?.bans.fetch().then(x => x.get(str));

    if (!ban) {
      context.reply({ content: t('command:guild/ban/error/noBan'), ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor('Purple')
      .setTitle(t('command:guild/bans/embed/title', { user: ban.user.tag }))
      .setThumbnail(ban?.user.displayAvatarURL({ extension: 'jpg' }))
      .addFields([
        {
          name: t('command:guild/bans/embed/field/name/id'),
          value: `\`${ban?.user.id}\``,
          inline: false,
        },
        {
          name: t('command:guild/bans/embed/field/name/tag'),
          value: `\`${ban?.user.tag}\``,
          inline: false,
        },
        {
          name: t('command:guild/bans/embed/field/name/reason'),
          value: `\`${ban?.reason ?? t('command:guild/bans/embed/field/value/reason')}\``,
          inline: false,
        },
      ])
      .setFooter({ text: `${context.user.tag}`, iconURL: context.user.displayAvatarURL({ extension: 'jpg' }) });

    context.reply({ embeds: [embed] });
  }

  async executeAutoComplete({ interaction }: AutoCompleteExecuteOptions) {
    const t = i18next.getFixedT(interaction.locale);
    const bans = await interaction.guild?.bans.fetch({ cache: true, limit: 25 });

    if (!bans) return;

    if (bans.size === 0) {
      interaction.respond([{ value: 'none', name: t('command:guild/bans/autocomplete/noBans') }]);
      return;
    }

    interaction.respond(bans.map(ban => ({ value: ban.user.id, name: `${ban.user.tag} | ${ban.user.id}` })));
  }
}
