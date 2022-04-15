/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interaction, AutocompleteInteraction, InteractionDataOptionWithValue, CommandInteraction } from 'eris';
import i18next from 'i18next';
import CommandContext from '../Structures/CommandContext';
import SukiClient from '../SukiClient';

export default class InteractionCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'interactionCreate';
  }

  async execute(interaction: Interaction) {
    if(interaction instanceof AutocompleteInteraction) {
      if (!interaction.member) return;
      const cmd = this.client.commands.find(c => c.name === interaction.data.name);

      if (!cmd) throw new Error(`Command ${interaction.data.name} does not exist!`);

      const options = interaction.data.options as InteractionDataOptionWithValue[] ;

      const focusedField = options.find(o => o.focused);

      cmd.executeAutoComplete(interaction, focusedField!.value as string, options);
      return;
    }

    if(interaction instanceof CommandInteraction) {
      if(!interaction.member) {
        return;
      }

      var t = global.t = i18next.getFixedT('pt-BR');

      const cmd = this.client.commands.find(x => x.name === interaction.data.name);
      if (!cmd) throw new Error(`Command ${interaction.data.name} does not exist!`);

      const ctx = new CommandContext(this.client, interaction);

      try {
        cmd.execute(ctx, t);
      } catch (error: any) {
        interaction.createMessage(`\`\`\`${error.message}\`\`\``);
      }
    }
  }
}