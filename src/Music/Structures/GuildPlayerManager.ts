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
    if (!context.interaction.inGuild()) return;

    if (!context.voice.channelId) {
      context.reply({ content: t('command:play/error/noChannel'), ephemeral: true });
      return;
    }

    if (context.player && context.voice.channelId !== context.player.voiceChannelId) {
      context.reply({ content: t('command:play/error/noChannel'), ephemeral: true });
      return;
    }

    try {
      const res = await this.client.music.search(context.options.getString('song', true));

      if (res.loadType === 'LOAD_FAILED') {
        context.reply({ content: t('command:play/error/invalidLink'), ephemeral: true });
        return;
      }

      if (res.loadType === 'NO_MATCHES') {
        context.reply({ content: t('command:play/error/noMatches'), ephemeral: true });
        return;
      }

      const player = this.client.music.createPlayer({
        guildId: context.interaction.guildId,
        voiceChannelId: context.voice.channelId,
        textChannelId: context.channel.id,
        selfDeaf: true,
      });

      player.connect();

      if (res.loadType === 'PLAYLIST_LOADED') {
        for (const track of res.tracks) {
          player.queue.push(track);
          track.setRequester(context.user);
        }

        if (!player.playing) player.play();

        const embed = new EmbedBuilder()
          .setTitle(res.playlistInfo.name)
          .setTimestamp()
          .setColor('Purple')
          .addFields([
            {
              name: t('command:play/embed/field/duration'),
              value: dayjs(res.playlistInfo.duration).format('DD:HH:mm'),
              inline: true,
            },
            {
              name: t('command:play/embed/field/amountTracks'),
              value: `${t('command:play/embed/value/amount', { tracks: res.tracks.length.toString() })}`,
            },
          ])
          .setFooter({ text: `${context.user.tag}`, iconURL: context.user.displayAvatarURL({ extension: 'jpg' }) });

        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(context.options.getString('song', true)) &&
          embed.setURL(context.options.getString('song', true));

        context.reply({ embeds: [embed] });
      } else {
        const { tracks } = res;
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
