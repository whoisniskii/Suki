/* eslint-disable no-var */
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, GuildMember } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';
import GuildPlayer from '../../Music/Structures/GuildPlayerManager';
import { Choices } from '../../typings/index';

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
          required: true,
          autocomplete: true,
        }]
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction, t: typeof globalThis.t) {

    const player = new GuildPlayer(this.client, interaction);
    const args = interaction.options.get('track');

    await player.createPlayer(args?.value as string, interaction.member as GuildMember, interaction, t);
  }

  async executeAutoComplete(interaction: AutocompleteInteraction, value: string) {
    if (!value) {
      interaction.respond([]);
      return;
    }

    const res = await this.client.request(`https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&callback=json&q=${encodeURIComponent(value)}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
      }
    }).then(async r => Buffer.from(await r.body.arrayBuffer()).toString('latin1'));

    const choices: Choices[] = [];

    const data = res.split('[');

    for (var i = 3, min = Math.min(8 * 2, data.length); i < min; i += 2) {
      const choice = data[i].split('"')[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, cc) => String.fromCharCode(parseInt(cc, 16)));

      if (choice) {
        choices.push({
          name: choice,
          value: choice
        });
      }

      interaction.respond(choices);
    }
  }
}