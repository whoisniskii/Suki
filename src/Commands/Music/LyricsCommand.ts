import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';
import songlyrics from 'songlyrics';

export default class LyricsCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'lyrics',
      description: '[ 🎵 Music ] Shows the lyrics of a song.',
      description_localizations: {
        'pt-BR': '[ 🎵 Música ] Mostra a letra de uma música.',
      },
      options: [{
        name: 'song',
        name_localizations: {
          'pt-BR': 'música',
        },
        description: 'Song Name',
        description_localizations: {
          'pt-BR': 'Nome da música',
        },
        type: 3,
        required: true,
      }]
    }, client);
  }

  async execute(context: CommandContext, t: typeof globalThis.t): Promise<void> {

    songlyrics(context.options.join(' '))
      .then(song => {
        const embed = [{
          author: {
            name: t('commands:lyrics.source', { source: song.source.name }),
            url: song.source.link,
          },
          timestamp: new Date(),
          color: 10105592,
          description: song.lyrics.replace(/\n/g, '\n').slice(0, 4000),
          footer: { text: `${context.author.username}#${context.author.discriminator}`, icon_url: context.author.dynamicAvatarURL() },
        }];

        context.send({ embeds: embed });
      }).catch(console.log);
  }
}