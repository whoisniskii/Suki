import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
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
    await context.defer();
    let result;

    if (!context.options.getString('song', false) && !context.options.getString('artist', false)) {
      if (!context.player || !context.player.current) {
        const activity = context.member?.presence?.activities?.find(a => a.name === 'Spotify');

        if (activity && activity.details) {
          const artist = activity.state?.replace(';', ',');
          result = await this.lyrics(activity.details, artist as string);
        }

        if (!activity) {
          context.reply(t('commands:lyrics/error/noPlayer'));
          return;
        }

        if (context.player && context.player.current) {
          result = await this.lyrics(context.player.current.title, context.player.current.author);
        }
      }
    }

    if (context.options.getString('song', false) && context.options.getString('artist', false)) {
      result = await this.lyrics(context.options.getString('song', false) as string, context.options.getString('artist', false) as string);
    }

    if (!result?.song) {
      context.reply(t('commands:lyrics/error/notFound'));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${result.name}`,
      })
      .setTimestamp()
      .setColor('Purple')
      .setDescription(result.song.lyrics_body.replace(/\n/g, '\n').slice(0, 4000))
      .setFooter({ text: `${result.song.lyrics_copyright.slice(0, 37)}`, iconURL: 'https://imgur.com/aLTdLUT.png' });

    context.reply({ embeds: [embed] });
  }

  async lyrics(track: string, artist: string) {
    const song = await this.client.music.musixmatch.matchLyrics({ track, artist });

    const name = `${track} - ${artist}`.replace(/feat.|ft./g, '').trim();

    const data = {
      song,
      name,
    };

    return data;
  }
}
