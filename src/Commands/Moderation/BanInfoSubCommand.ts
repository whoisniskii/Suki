import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import i18next from 'i18next';
import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class BanInfoSubCommand extends Command {
  constructor(client: Suki) {
    super(client);
    this.rawName = 'BansInfoSubCommand';
    this.config = {
      registerSlashCommands: false,
      devOnly: false,
    };
    this.permissions = {
      bot: [PermissionFlagsBits.BanMembers, PermissionFlagsBits.EmbedLinks],
      user: [PermissionFlagsBits.BanMembers],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const str = context.options.getString('user', true);

    if (str === 'none') {
      context.sendMessage({ content: t('command:server/bans/error/noUser'), ephemeral: true });
      return;
    }

    const ban = await context.guild?.bans.fetch(str);

    if (!ban) {
      context.sendMessage({ content: t('command:server/bans/error/noBan'), ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor('Purple')
      .setTitle(t('command:server/bans/embed/title', { user: ban.user.tag }))
      .setThumbnail(ban?.user.displayAvatarURL({ extension: 'png' }))
      .addFields([
        {
          name: t('command:server/bans/embed/field/name/id'),
          value: `\`${ban?.user.id}\``,
          inline: false,
        },
        {
          name: t('command:server/bans/embed/field/name/tag'),
          value: `\`${ban?.user.tag}\``,
          inline: false,
        },
        {
          name: t('command:server/bans/embed/field/name/reason'),
          value: `\`${ban?.reason ?? t('command:server/bans/embed/field/value/reason')}\``,
          inline: false,
        },
      ])
      .setFooter({ text: `${context.user.tag}`, iconURL: context.user.displayAvatarURL({ extension: 'jpg' }) });

    context.sendMessage({ embeds: [embed] });
  }

  async executeAutoComplete({ interaction }: AutoCompleteExecuteOptions) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers) && !interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
      interaction.respond([]);
      return;
    }

    const t = i18next.getFixedT(this.client.languages.languageManager.recommendedLocale(interaction.locale));
    const bans = await interaction.guild?.bans.fetch({ cache: true, limit: 25 });

    if (!bans) {
      interaction.respond([]);
      return;
    }

    if (bans.size === 0) {
      interaction.respond([{ value: 'none', name: t('command:server/bans/autocomplete/noBans') }]);
      return;
    }

    interaction.respond(bans.map(ban => ({ value: ban.user.id, name: `${ban.user.tag} | ${ban.user.id}` })));
  }
}
