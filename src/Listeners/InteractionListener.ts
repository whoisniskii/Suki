import { AutocompleteInteraction, CommandInteraction, Interaction } from 'discord.js';
import { getFixedT } from 'i18next';
import { CommandContext, Event } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class InteractionCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'interactionCreate';
  }

  execute(client: SukiClient, interaction: Interaction) {
    if (interaction instanceof AutocompleteInteraction) {
      if (!interaction.member) return;
      const cmd = client.commands.find(c => c.rawName === interaction.commandName);

      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const { options } = interaction;

      const value = options.data.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction instanceof CommandInteraction) {
      if (!interaction.isChatInputCommand()) return;

      const t = getFixedT(interaction.locale || 'en-US');

      const cmd = client.commands.find(x => x.rawName === interaction.commandName);
      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      if (!interaction.inGuild() && cmd.config.guildOnly) {
        interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate.errors/guildOnly')}`, ephemeral: true });
        return;
      }

      const context = new CommandContext(client, {
        interaction,
      });

      try {
        cmd.execute({ context, t });
      } catch (error: any) {
        interaction.editReply(`\`\`\`${error.message}\`\`\``);
      }
    }
  }
}
