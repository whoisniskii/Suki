import { EmbedBuilder } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class LyricsCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'lyrics',
        nameLocalizations: {
          'pt-BR': 'letra',
        },
        description: '[ 🎵 Music ] Shows the lyrics of a song.',
        descriptionLocalizations: {
          'pt-BR': '[ 🎵 Música ] Mostra a letra de uma música.',
        },
        options: [
          {
            name: 'song',
            nameLocalizations: {
              'pt-BR': 'música',
            },
            description: 'Song Name',
            descriptionLocalizations: {
              'pt-BR': 'Nome da música',
            },
            type: 3,
            required: false,
          },
          {
            name: 'artist',
            nameLocalizations: {
              'pt-BR': 'artista',
            },
            description: 'Artist Name',
            descriptionLocalizations: {
              'pt-BR': 'Nome do artista',
            },
            type: 3,
            required: false,
          },
        ],
      },
      client,
    );

    this.config = {
      guildOnly: true,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    let track = await context.musixmatch.searchTrack(context.options.get('song', true).value as string, context.options.get('artist', true).value as string);

    if (!context.options) {
      if (!context.player || !context.player.current) {
        const activity = context.member?.presence?.activities?.find(a => a.name === 'Spotify');

        if (activity && activity.details) {
          track = await context.musixmatch.searchTrack(activity?.details as string, activity?.state as string);
        }

        if (!activity) {
          context.reply(t('commands:lyrics.no_player'));
          return;
        }

        if (context.player && context.player.current) {
          track = await context.musixmatch.searchTrack(context.player.current.title, context.player.current.author);
        }
      }
    }

    if (!track) {
      context.reply(t('commands:lyrics.not_found'));
      return;
    }

    const lyrics = await context.musixmatch.getLyrics(track.track_id);

    if (!lyrics) {
      context.reply(t('commands:lyrics.not_found'));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${track.track_name} - ${track.artist_name}`,
        url: track.track_share_url,
      })
      .setTimestamp()
      .setColor(10105592)
      .setDescription(lyrics.lyrics_body.replace(/\n/g, '\n').slice(0, 4000))
      .setFooter({ text: `${lyrics.lyrics_copyright.slice(0, 37)}`, iconURL: 'https://imgur.com/aLTdLUT.png' });

    context.reply({ embeds: [embed] });
  }
}
