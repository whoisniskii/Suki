import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { GuildPlayer } from '../../Music';
import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class PlayCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: client.languages.languageManager.get('en-US', 'commandNames:play'),
        nameLocalizations: {
          'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:play'),
        },
        description: client.languages.languageManager.get('en-US', 'commandDescriptions:play'),
        descriptionLocalizations: {
          'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:play'),
        },
        options: [
          {
            name: client.languages.languageManager.get('en-US', 'commandNames:play/song'),
            nameLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:play/song'),
            },
            description: client.languages.languageManager.get('en-US', 'commandDescriptions:play/song'),
            descriptionLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:play/song'),
            },
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
          },
        ],
      },
      client,
    );

    this.permissions = {
      bot: [PermissionFlagsBits.EmbedLinks],
      user: [],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const player = new GuildPlayer(this.client);

    await player.createPlayer({ context, t });
  }

  async executeAutoComplete({ interaction, value }: AutoCompleteExecuteOptions) {
    if (!value) {
      interaction.respond([]);
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

    interaction.respond(choices);
  }
}

interface Choices {
  name: string;
  value: string;
}
