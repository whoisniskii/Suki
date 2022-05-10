import { AutocompleteInteraction, CommandInteraction, Interaction } from 'discord.js';
import { getFixedT } from 'i18next';
import { CommandContext } from '../Structures';
import { SukiClient } from '../SukiClient';

export default class InteractionCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'interactionCreate';
  }

  async execute(interaction: Interaction) {
    if (interaction instanceof AutocompleteInteraction) {
      if (!interaction.member) return;
      const cmd = this.client.commands.find(c => c.rawName === interaction.commandName);

      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      const { options } = interaction;

      const value = options.data.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction instanceof CommandInteraction) {
      if (!interaction.isChatInputCommand()) return;

      const t = getFixedT(interaction.locale);

      const cmd = this.client.commands.find(x => x.rawName === interaction.commandName);
      if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

      if (!interaction.inGuild() && cmd.config.guildOnly) {
        interaction.reply({ content: `❌ ${interaction.user} **|** ${t('events:interactionCreate.errors/guildOnly')}`, ephemeral: true });
        return;
      }

      if (cmd.config.autoDefer) await interaction.deferReply({ ephemeral: cmd.config.ephemeral });

      const context = new CommandContext(this.client, {
        client: this.client,
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
