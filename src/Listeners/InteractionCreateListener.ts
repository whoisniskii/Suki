import { ChatInputCommandInteraction, Interaction, PermissionsBitField } from 'discord.js';
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
    if (interaction.isAutocomplete() && interaction.inGuild()) {
      const cmd = client.commands.find(c => c.rawName === interaction.commandName);
      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const { options } = interaction;

      const value = interaction.options.data.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction.isChatInputCommand()) {
      const t = getFixedT(client.languages.languageManager.recommendedLocale(interaction.locale));

      const cmd = client.commands.find(c => c.rawName === interaction.commandName);
      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      if (interaction.inGuild()) {
        if (!InteractionCreateEvent.checkBotPermissions(interaction, cmd, t)) return;
        if (!InteractionCreateEvent.checkMemberPermissions(interaction, cmd, t)) return;
      }

      if (cmd.config.devOnly && client.developers.some(x => x !== interaction.user.id)) {
        interaction.reply({ content: `❌ **|** ${t('events:interactionCreate/permissions/devOnly')}`, ephemeral: true });
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

  static checkBotPermissions(interaction: ChatInputCommandInteraction, command: Command, t: TFunction) {
    const sendPermissionError = (cmd: Command<SukiClient>) => {
      const permissions = new PermissionsBitField(cmd.permissions.bot)
        .toArray()
        .map(p => t(`permissions:${p}`))
        .join(', ');
      interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate/permissions/bot/missing', { perms: `\`${permissions.toString()}\`` })}`, ephemeral: true });
      return false;
    };

    const findSubCommand = (name: string | null) => {
      if (!name) return undefined;
      const subCommand = (interaction.client as SukiClient).commands.find(c => c.rawName.toLowerCase().includes(name) && c.rawName.endsWith('SubCommand'));
      return subCommand;
    };

    const subCommand = findSubCommand(interaction.options.getSubcommand(false));
    if (subCommand) {
      if (!interaction.guild?.members.me?.permissions.has(subCommand.permissions.bot)) return sendPermissionError(subCommand);
    }

    if (command.permissions.bot.length === 0) return true;
    if (!interaction.guild?.members.me?.permissions.has(command.permissions.bot)) return sendPermissionError(command);
    return true;
  }

  static checkMemberPermissions(interaction: ChatInputCommandInteraction, command: Command, t: TFunction) {
    const sendPermissionError = (cmd: Command<SukiClient>) => {
      const permissions = new PermissionsBitField(cmd.permissions.user)
        .toArray()
        .map(p => t(`permissions:${p}`))
        .join(', ');
      interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate/permissions/user/missing', { perms: `\`${permissions.toString()}\`` })}`, ephemeral: true });
      return false;
    };

    const findSubCommand = (name: string | null) => {
      if (!name) return undefined;
      const subCommand = (interaction.client as SukiClient).commands.find(c => c.rawName.toLowerCase().includes(name) && c.rawName.endsWith('SubCommand'));
      return subCommand;
    };

    const subCommand = findSubCommand(interaction.options.getSubcommand(false));
    if (subCommand) {
      if (!interaction.memberPermissions?.has(subCommand.permissions.user)) return sendPermissionError(subCommand);
    }

    if (!command.permissions.user.length) return true;
    if (!interaction.memberPermissions?.has(command.permissions.user)) return sendPermissionError(command);
    return true;
  }
}
