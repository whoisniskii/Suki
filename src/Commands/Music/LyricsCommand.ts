import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class LyricsCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'lyrics',
        description: '[ 🎵 Music ] Shows the lyrics of a song.',
        description_localizations: {
          'pt-BR': '[ 🎵 Música ] Mostra a letra de uma música.',
        },
        options: [
          {
            name: 'song',
            name_localizations: {
              'pt-BR': 'música',
            },
            description: 'Song Name',
            description_localizations: {
              'pt-BR': 'Nome da música',
            },
            type: 3,
            required: false,
          },
          {
            name: 'artist',
            name_localizations: {
              'pt-BR': 'artista',
            },
            description: 'Artist Name',
            description_localizations: {
              'pt-BR': 'Nome do artista',
            },
            type: 3,
            required: false,
          },
        ],
      },
      client,
    );
  }

  async execute({ context, t }: CommandExecuteOptions) {
    let track = await context.musixmatch.searchTrack(context.options[0], context.options[1]);

    if (!context.options.length) {
      if (!context.player || !context.player.current) {
        const activity = context.member?.activities?.find(a => a.name === 'Spotify');

        if (activity && activity.details) {
          track = await context.musixmatch.searchTrack(activity?.details as string, activity?.state as string);
        }

        if (!activity) {
          context.editReply(t('commands:lyrics.no_player'));
          return;
        }

        if (context.player && context.player.current) {
          track = await context.musixmatch.searchTrack(context.player.current.title, context.player.current.author);
        }
      }
    }

    if (!track) {
      context.editReply(t('commands:lyrics.not_found'));
      return;
    }

    const lyrics = await context.musixmatch.getLyrics(track.track_id);

    if (!lyrics) {
      context.editReply(t('commands:lyrics.not_found'));
      return;
    }

    const embed = [
      {
        author: {
          name: `${track.track_name} - ${track.artist_name}`,
          url: track.track_share_url,
        },
        timestamp: new Date(),
        color: 10105592,
        description: lyrics.lyrics_body.replace(/\n/g, '\n').slice(0, 4000),
        footer: { text: `${lyrics.lyrics_copyright.slice(0, 37)}`, icon_url: 'https://imgur.com/aLTdLUT.png' },
      },
    ];

    context.editReply({ embeds: embed });
  }
}
