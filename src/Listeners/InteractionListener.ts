/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteInteraction, CommandInteraction, Interaction, InteractionDataOptionWithValue } from 'eris';
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

  execute(interaction: Interaction) {
    if (interaction instanceof AutocompleteInteraction) {
      if (!interaction.member) return;
      const cmd = this.client.commands.find(c => c.name === interaction.data.name);

      if (!cmd) throw new Error(`Command ${interaction.data.name} does not exist!`);

      const options = interaction.data.options as InteractionDataOptionWithValue[];

      const value = options.find(o => o.focused)?.value as string;

      cmd.executeAutoComplete({ interaction, value, options });
      return;
    }

    if (interaction instanceof CommandInteraction) {
      if (!interaction.member) {
        return;
      }

      const t = getFixedT('pt-BR');

      const cmd = this.client.commands.find(x => x.name === interaction.data.name);
      if (!cmd) throw new Error(`Command ${interaction.data.name} does not exist!`);

      const context = new CommandContext(this.client, interaction);

      try {
        cmd.execute({ context, t });
      } catch (error: any) {
        interaction.createMessage(`\`\`\`${error.message}\`\`\``);
      }
    }
  }
}
