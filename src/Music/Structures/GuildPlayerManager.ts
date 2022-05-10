/* eslint-disable no-unused-expressions */
import dayjs from 'dayjs';
import { EmbedBuilder } from 'discord.js';
import { TFunction } from 'i18next';
import { CommandContext } from '../../Structures';
import { SukiClient } from '../../SukiClient';

class GuildPlayer {
  client: SukiClient;
  interaction: CommandContext;

  constructor(client: SukiClient, interaction: CommandContext) {
    this.client = client;
    this.interaction = interaction;
  }

  async createPlayer(context: CommandContext, t: TFunction) {
    const voiceChannelID = context.voice?.channelId;

    if (!voiceChannelID) {
      context.interaction.followUp({ content: t('commands:play.noChannel'), flags: 64 });
      return;
    }

    if (context.player && voiceChannelID !== context.player.voiceChannelId) {
      context.send({ content: t('commands:play.noChannel'), flags: 64 });
      return;
    }

    try {
      let music = context.options.get('song', true).value as string;

      if (!music) {
        const activity = context.member?.presence?.activities.find(x => x.name === 'Spotify');

        if (!activity) {
          context.send({ content: t('commands:play.noArgs'), flags: 64 });
          return;
        }

        music = `https://open.spotify.com/track/${activity.party?.id}`;
      }

      const result = await this.client.music.search(music, 'youtube');

      if (result.loadType === 'LOAD_FAILED') {
        context.send({ content: t('commands:play.failed'), flags: 64 });
        return;
      }

      if (result.loadType === 'NO_MATCHES') {
        context.send({ content: t('commands:play.noMatches'), flags: 64 });
        return;
      }

      const player = this.client.music.createPlayer({
        guildId: context.guild?.id as string,
        voiceChannelId: voiceChannelID as string,
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
          .setColor(10105592)
          .addFields([
            {
              name: t('commands:play.embed.duration'),
              value: dayjs(result.playlistInfo?.duration).format('DD:HH:mm'),
              inline: true,
            },
            {
              name: t('commands:play.embed.amountTracks'),
              value: `${t('commands:play.embed.amount', { tracks: result.tracks.length.toString() })}`,
            },
          ])
          .setFooter({ text: `${context.user.username}#${context.user.discriminator}`, iconURL: context.user.displayAvatarURL() });

        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

        regex.test(context.options.get('song', true).value as string) && embed.setURL(context.options.get('song', true).value as string);

        context.send({ embeds: [embed] });
      } else {
        const { tracks } = result;
        const msc = tracks[0];
        msc.setRequester(context.user);
        player.queue.push(msc);

        if (!player.playing) player.play();

        context.send(t('commands:play.queue', { track: msc.title, author: msc.author }));
      }
    } catch (error) {
      throw new Error('Error while playing music');
    }
  }
}

export { GuildPlayer };
