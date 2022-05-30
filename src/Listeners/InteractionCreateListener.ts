import { ChatInputCommandInteraction, GuildMember, Interaction, PermissionsBitField } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';
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
      const cmd = client.commands.find(c => c.rawName === interaction.commandName);

      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const { options } = interaction;

      const value = options.data.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction.isChatInputCommand()) {
      const t = getFixedT(interaction.locale);

      const cmd = client.commands.find(x => x.rawName === interaction.commandName);
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
