/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interaction } from 'discord.js';
import SukiClient from '../SukiClient';

export default class InteractionCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'interactionCreate';
  }

  async execute(interaction: Interaction) {
    if(interaction.isChatInputCommand()) {
      const cmd = this.client.commands.find(x => x.name === interaction.commandName);

      if(!interaction.guild) return;

      try {
        cmd?.execute(interaction);
      } catch (error: any) {
        interaction.reply(error.message);
      }
    }
  }
}