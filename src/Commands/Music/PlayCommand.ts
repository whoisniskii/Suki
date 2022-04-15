/* eslint-disable no-var */
import { AutocompleteInteraction } from 'eris';
import SukiClient from '../../SukiClient';
import GuildPlayer from '../../Music/Structures/GuildPlayerManager';
import { Choices } from '../../typings/index';
import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';

export default class PlayCommand extends Command {
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
          type: 3,
          required: true,
          autocomplete: true,
        }]
      }
    }, client);
  }

  async execute(context: CommandContext, t: typeof globalThis.t): Promise<void> {

    const player = new GuildPlayer(this.client, context);

    await player.createPlayer(context, t);
  }

  async executeAutoComplete(interaction: AutocompleteInteraction, value: string) {
    if (!value) {
      interaction.result([]);
      return;
    }

    const res = await this.client.request(`https://clients1.google.com/complete/search?client=youtube&hl=pt-BR&ds=yt&q=${encodeURIComponent(value)}`, {
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
    }

    interaction.result(choices);
  }
}