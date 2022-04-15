/* eslint-disable no-useless-escape */
import dayjs from 'dayjs';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';

export default class GuildPlayer {
  client: SukiClient;
  interaction: CommandContext;

  constructor(client: SukiClient, interaction: CommandContext) {
    this.client = client;
    this.interaction = interaction;
  }

  async createPlayer(context: CommandContext, t: typeof globalThis.t) {
    const voiceChannelID = context.member?.voiceState.channelID;

    if(!voiceChannelID) {
      context.send({ content: t('commands:play.noChannel'), flags: 64 });
    }

    const playerr = context.player;

    if(playerr && voiceChannelID !== playerr.voiceChannelId) {
      context.send({ content: t('commands:play.noChannel'), flags: 64 });
    }

    try {

      let music = context.options.join(' ');

      if(!music) {
        const activity = context.member?.activities?.find(x => x.name === 'Spotify');

        if(!activity) {
          context.send({ content: t('commands:play.noArgs'), flags: 64 });
        }

        console.log(activity);

        music = `https://open.spotify.com/track/${activity?.syncId}`;
      }

      const result = await this.client.playerManager.search(music, 'youtube');

      if (result.loadType === 'LOAD_FAILED') {
        return context.send({ content: t('commands:play.failed'), flags: 64 });
      }

      if (result.loadType === 'NO_MATCHES') {
        return context.send({ content: t('commands:play.noMatches'), flags: 64 });
      }

      const player = this.client.playerManager.createPlayer({
        guildId: context.guild?.id,
        voiceChannelId: voiceChannelID as string,
        textChannelId: context.channel.id,
        selfDeaf: true,
      });

      player.connect();

      if (result.loadType === 'PLAYLIST_LOADED') {
        for (const track of result.tracks) {
          player.queue.push(track);
          track.setRequester(context.author);
        }

        if (!player.playing) player.play();

        const embed = [{
          title: `${result.playlistInfo.name}`,
          timestamp: new Date(),
          color: 993399,
          fields: [
            {
              name: t('commands:play.embed.duration'),
              value: dayjs(result.playlistInfo?.duration).format('DD:HH:mm'),
              inline: true,
            },
            {
              name: t('commands:play.embed.amountTracks'),
              value: `${result.tracks.length} ${t('commands:play.embed.amount')}`
            }
          ],
          footer: { text: `${context.author.username}#${context.author.discriminator}`, icon_url: context.author.dynamicAvatarURL() }
        }];

        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        regex.test(context.options.join(' ')) && Object.assign(embed, { url: context.options.join(' ') });

        context.channel?.createMessage({ embeds: embed });
      }
      else {
        const tracks = result.tracks;
        const msc = tracks[0];
        msc.setRequester(context.author);
        player.queue.push(msc);

        if (!player.playing) {
          context.send({ content: t('commands:play.queue', { track: msc.title, author: msc.author }), flags: 64 });
          player.play();
          return;
        }

        if(player.playing) {
          return context.send(t('commands:play.queue', { track: msc.title, author: msc.author }));
        }
      }
    } catch (error) {
      context.send('Ocorreu um erro');
    }
  }
}