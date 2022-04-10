import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';
import GuildPlayer from '../../Music/Structures/GuildPlayerManager';

export default class PlayCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'play',
      category: 'Music',
      data: {
        name: 'play',
        description: 'Play command',
        options: [{
          name: 'track',
          description: 'Music you want to play.',
          type: ApplicationCommandOptionType.String,
          required: true
        }]
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction, t: typeof globalThis.t) {

    const player = new GuildPlayer(this.client, interaction);
    const args = interaction.options.get('track');

    await player.createPlayer(args?.value as string, interaction.member as GuildMember, interaction, t);
  }
}