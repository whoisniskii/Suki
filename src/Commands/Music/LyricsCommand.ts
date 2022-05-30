import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class LyricsCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'lyrics';
    this.permissions = {
      bot: [PermissionFlagsBits.EmbedLinks],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: false,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    await context.defer();
    let result;

    if (!context.options.getString('song', false) && !context.options.getString('artist', false)) {
      if (!context.player || !context.player.current) {
        const activity = context.member?.presence?.activities?.find(a => a.name === 'Spotify');

        if (activity && activity.details) {
          result = await this.getLyrics(activity.details, activity.state as string);
        }

        if (!activity) {
          context.reply(t('command:lyrics/error/noPlayer'));
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
      context.reply(t('command:lyrics/error/notFound'));
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
