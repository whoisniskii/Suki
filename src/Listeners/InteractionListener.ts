/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteInteraction, CommandInteractionOption, Interaction } from 'discord.js';
import i18next from 'i18next';
import SukiClient from '../SukiClient';

export default class InteractionCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'interactionCreate';
  }

  async execute(interaction: Interaction) {
    if(interaction.isAutocomplete()) {
      if (interaction instanceof AutocompleteInteraction) {
        if (!interaction.member) return;
        const cmd = this.client.commands.find(c => c.name === interaction.commandName);

        if (!cmd) throw new Error(`Command ${interaction.commandName} does not exist!`);

        const options = interaction.options.data as CommandInteractionOption[];

        const focusedField = options.find(o => o.focused);

        cmd.executeAutoComplete(interaction, focusedField!.value as string, options);
        return;
      }
    }

    if(interaction.isChatInputCommand()) {

      var t = global.t = i18next.getFixedT(interaction.locale || 'pt-BR');

      const cmd = this.client.commands.find(x => x.name === interaction.commandName);

      if(!interaction.guild) return;

      try {
        cmd?.execute(interaction, t);
      } catch (error: any) {
        interaction.reply(error.message);
      }
    }
  }
}