import { ChatInputCommandInteraction, GuildMember, Interaction, Locale, PermissionsBitField } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';
import { SupportedLocales } from '../Managers';
import { Command, CommandContext, Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class InteractionCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'interactionCreate';
  }

  execute(client: SukiClient, interaction: Interaction) {
    if (interaction.isAutocomplete()) {
      if (!interaction.member) return;
      const cmd = client.commands.get(interaction.commandName);

      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const { options } = interaction;

      const value = options.data.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction.isChatInputCommand()) {
      const t = getFixedT(InteractionCreateEvent.recommendedLocale(interaction.locale));

      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      if (interaction.inGuild()) {
        if (!InteractionCreateEvent.checkBotPermissions(interaction, cmd, t)) return;
        if (!InteractionCreateEvent.checkMemberPermissions(interaction, cmd, t)) return;
      }

      if (cmd.config.devOnly === true && client.developers.some(x => x !== interaction.user.id)) {
        interaction.reply(`❌ **|** ${t('events:interactionCreate/permissions/devOnly')}`);
        return;
      }

      const context = new CommandContext(client, interaction);

      try {
        cmd.execute({ context, t });
      } catch (error: any) {
        interaction.editReply(`\`\`\`${error.message}\`\`\``);
      }
    }
  }

  static recommendedLocale(locale: Locale) {
    let recommendedLocale = 'en-US' as SupportedLocales;

    switch (locale.replace('_', '-')) {
      case Locale.EnglishUS:
      case Locale.EnglishGB:
        recommendedLocale = 'en-US';
        break;
      case Locale.PortugueseBR:
        recommendedLocale = 'pt-BR';
        break;
    }
    return recommendedLocale;
  }

  static checkBotPermissions(interaction: ChatInputCommandInteraction, command: Command, t: TFunction): boolean {
    if (command.permissions.bot.length === 0) return true;
    if (!interaction.guild?.members.me?.permissions.has(command.permissions.bot)) {
      const permissions = new PermissionsBitField(command.permissions.bot)
        .toArray()
        .map(p => t(`permissions:${p}`))
        .join(', ');
      interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate/permissions/bot/missing', { perms: `\`${permissions.toString()}\`` })}`, ephemeral: true });
      return false;
    }
    return true;
  }

  static checkMemberPermissions(interaction: ChatInputCommandInteraction, command: Command, t: TFunction): boolean {
    if (command.permissions.user.length === 0) return true;
    if (!(interaction.member as GuildMember).permissions.has(command.permissions.user)) {
      const permissions = new PermissionsBitField(command.permissions.user)
        .toArray()
        .map(p => t(`permissions:${p}`))
        .join(', ');
      interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate/permissions/user/missing', { perms: `\`${permissions.toString()}\`` })}`, ephemeral: true });
      return false;
    }
    return true;
  }
}
