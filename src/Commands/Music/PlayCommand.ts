import { GuildPlayer } from '../../Music';
import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';
import { Choices } from '../../typings/index';

export default class PlayCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'play',
        name_localizations: {
          'pt-BR': 'tocar',
        },
        description: '[ 🎵 Music ] Add a song to play.',
        description_localizations: {
          'pt-BR': '[ 🎵 Música ] Adiciona uma música para tocar.',
        },
        options: [
          {
            name: 'song',
            name_localizations: {
              'pt-BR': 'música',
            },
            description: 'Song/Playlist URL/Name',
            description_localizations: {
              'pt-BR': 'Música/Playlist URL/Nome',
            },
            type: 3,
            required: true,
            autocomplete: true,
          },
        ],
      },
      client,
    );
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const player = new GuildPlayer(this.client, context);

    await player.createPlayer(context, t);
  }

  async executeAutoComplete({ interaction, value }: AutoCompleteExecuteOptions) {
    if (!value) {
      interaction.result([]);
      return;
    }

    const res = await this.client
      .request(`https://clients1.google.com/complete/search?client=youtube&hl=pt-BR&ds=yt&q=${encodeURIComponent(value)}`, {
        headers: {
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
        },
      })
      .then(async r => Buffer.from(await r.body.arrayBuffer()).toString('latin1'));

    const choices: Choices[] = [];

    const data = res.split('[');

    for (let i = 3, min = Math.min(8 * 2, data.length); i < min; i += 2) {
      const choice = data[i].split('"')[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, cc) => String.fromCharCode(parseInt(cc, 16)));

      if (choice) {
        choices.push({
          name: choice,
          value: choice,
        });
      }
    }

    interaction.result(choices);
  }
}
