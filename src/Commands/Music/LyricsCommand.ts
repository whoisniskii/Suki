import { ApplicationCommandOptionType, EmbedBuilder, GuildMember, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class LyricsCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'lyrics',
        nameLocalizations: {
          'pt-BR': 'letras',
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
            type: ApplicationCommandOptionType.String,
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
            type: ApplicationCommandOptionType.String,
            required: false,
          },
          {
            name: 'member',
            nameLocalizations: {
              'pt-BR': 'membro',
            },
            description: 'Member',
            descriptionLocalizations: {
              'pt-BR': 'Membro',
            },
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
        dmPermission: false,
      },
      client,
    );

    this.permissions = {
      bot: [PermissionFlagsBits.EmbedLinks],
      user: [],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    await context.defer({ fetchReply: true });
    let result;

    if (!context.options.getString('song', false) && !context.options.getString('artist', false)) {
      if (!context.player || !context.player.current) {
        const member = (context.options.getMember('member') as GuildMember) ?? context.member;
        const activity = member.presence?.activities?.find(a => a.name === 'Spotify');

        if (activity && activity.details) {
          result = await this.getLyrics(activity.details, activity.state as string);
        }

        if (!activity) {
          context.reply(t('commands:lyrics/error/noPlayer'));
          return;
        }

        if (context.player && context.player.current) {
          result = await this.getLyrics(context.player.current.title, context.player.current.author);
        }
      }
    }

    if (context.options.getString('song', false) && context.options.getString('artist', false)) {
      result = await this.getLyrics(context.options.getString('song', false) as string, context.options.getString('artist', false) as string);
    }

    if (!result?.lyrics) {
      context.reply(t('commands:lyrics/error/notFound'));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${result.trackName} - ${result.artistName}`,
        url: result.trackURL,
      })
      .setTimestamp()
      .setColor('Purple')
      .setDescription(result.lyrics)
      .setFooter({ text: `${result.copyright}`, iconURL: 'https://imgur.com/aLTdLUT.png' });

    context.reply({ embeds: [embed] });
  }

  async getLyrics(track: string, artist: string) {
    const song = await this.client.music.musixmatch.matchTrack({ track, artist });

    const lyrics = await this.client.music.musixmatch.getLyrics(song.commontrack_id);

    return {
      lyrics: lyrics.lyrics_body.replace(/\n/g, '\n').slice(0, 4000),
      copyright: lyrics.lyrics_copyright.slice(0, 37),
      trackName: song.track_name,
      artistName: song.artist_name,
      trackURL: song.track_share_url,
      trackId: song.track_id,
      albumName: song.album_name,
      commonTrackId: song.commontrack_id,
    };
  }
}
