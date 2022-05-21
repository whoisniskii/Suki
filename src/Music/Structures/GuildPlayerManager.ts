/* eslint-disable no-unused-expressions */
import dayjs from 'dayjs';
import { EmbedBuilder } from 'discord.js';
import { CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

class GuildPlayer {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async createPlayer({ context, t }: CommandExecuteOptions) {
    const voiceChannelID = context.voice?.channelId;

    if (!voiceChannelID) {
      context.reply({ content: t('command:play/error/noChannel'), flags: 64 });
      return;
    }

    if (context.player && voiceChannelID !== context.player.voiceChannelId) {
      context.reply({ content: t('command:play/error/noChannel'), flags: 64 });
      return;
    }

    try {
      let music = context.options.getString('song', true);

      if (!music) {
        const activity = context.member?.presence?.activities.find(x => x.name === 'Spotify');

        if (!activity) {
          context.reply({ content: t('command:play/error/noArgs'), flags: 64 });
          return;
        }

        music = `https://open.spotify.com/track/${activity.party?.id}`;
      }

      const result = await this.client.music.search(music, 'youtube');

      if (result.loadType === 'LOAD_FAILED') {
        context.reply({ content: t('command:play/error/invalidLink'), flags: 64 });
        return;
      }

      if (result.loadType === 'NO_MATCHES') {
        context.reply({ content: t('command:play/error/noMatches'), flags: 64 });
        return;
      }

      const player = this.client.music.createPlayer({
        guildId: context.guild?.id,
        voiceChannelId: voiceChannelID,
        textChannelId: context.channel.id,
        selfDeaf: true,
      });

      player.connect();

      if (result.loadType === 'PLAYLIST_LOADED') {
        for (const track of result.tracks) {
          player.queue.push(track);
          track.setRequester(context.user);
        }

        if (!player.playing) player.play();

        const embed = new EmbedBuilder()
          .setTitle(`${result.playlistInfo.name}`)
          .setTimestamp()
          .setColor('Purple')
          .addFields([
            {
              name: t('command:play/embed/field/duration'),
              value: dayjs(result.playlistInfo?.duration).format('DD:HH:mm'),
              inline: true,
            },
            {
              name: t('command:play/embed/field/amountTracks'),
              value: `${t('command:play/embed/value/amount', { tracks: result.tracks.length.toString() })}`,
            },
          ])
          .setFooter({ text: `${context.user.username}#${context.user.discriminator}`, iconURL: context.user.displayAvatarURL() });

        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

        regex.test(context.options.getString('song', true)) && embed.setURL(context.options.getString('song', true));

        context.reply({ embeds: [embed] });
      } else {
        const { tracks } = result;
        const msc = tracks[0];
        msc.setRequester(context.user);
        player.queue.push(msc);

        if (!player.playing) player.play();

        context.reply(t('command:play/queue', { track: `\`${msc.title}\``, author: `\`${msc.author}\`` }));
      }
    } catch (error) {
      throw new Error('Error while playing music');
    }
  }
}

export { GuildPlayer };
