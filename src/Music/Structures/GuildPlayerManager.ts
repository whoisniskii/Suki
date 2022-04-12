/* eslint-disable no-useless-escape */
import dayjs from 'dayjs';
import { CommandInteraction, EmbedBuilder, GuildMember, Util } from 'discord.js';
import SukiClient from '../../SukiClient';

export default class GuildPlayer {
  client: SukiClient;
  interaction: CommandInteraction;

  constructor(client: SukiClient, interaction: CommandInteraction) {
    this.client = client;
    this.interaction = interaction;
  }

  get player() {
    const player = this.client.playerManager.players.get(this.interaction.guild?.id as string);

    if(!player) {
      return undefined;
    }

    return player;
  }

  async createPlayer(args: string, member: GuildMember, interaction: CommandInteraction, t: typeof globalThis.t) {
    if(this.client.playerManager.players.get(interaction.guild?.id as string)) {
      if(member?.voice.channelId !== interaction.guild?.me?.voice.channelId) {
        interaction.reply({ content: t('commands:play.noChannel'), ephemeral: true });
      }
    }

    if(!member.voice.channel?.id) {
      interaction.reply({ content: t('commands:play.noChannel'), ephemeral: true });
    }

    let music = args;

    if(!music) {
      const activity = member?.presence?.activities.find(x => x.name === 'Spotify');

      if(!activity) {
        interaction.reply({ content: t('commands:play.noArgs'), ephemeral: true });
      }

      music = `https://open.spotify.com/track/${activity?.syncId}`;
    }

    const result = await this.client.playerManager.search(music, 'youtube');

    if (result.loadType === 'LOAD_FAILED') {
      return interaction.reply({ content: t('commands:play.failed'), ephemeral: true });
    }

    if (result.loadType === 'NO_MATCHES') {
      return interaction.reply({ content: t('commands:play.noMatches'), ephemeral: true });
    }

    const player = this.client.playerManager.createPlayer({
      guildId: interaction.guild?.id as string,
      voiceChannelId: member.voice.channel?.id as string,
      textChannelId: interaction.channel?.id,
      selfDeaf: true,
    });

    player.connect();

    if (result.loadType === 'PLAYLIST_LOADED') {
      for (const track of result.tracks) {
        player.queue.push(track);
        track.setRequester(interaction.user);
      }

      if (!player.playing) player.play();

      const embed = new EmbedBuilder()
        .setTitle(`${result.playlistInfo.name}`)
        .setTimestamp()
        .setColor(Util.resolveColor('Purple'))
        .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: true }) })
        .addFields({
          name: t('commands:play.embed.duration'),
          value: dayjs(result.playlistInfo?.duration).format('DD:HH:mm'),
          inline: true,
        },
        {
          name: t('commands:play.embed.amountTracks'),
          value: `${result.tracks.length} ${t('commands:play.embed.amount')}`
        });

      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

      regex.test(args) && embed.setURL(args);

      interaction.channel?.send({ embeds: [embed] });
    }
    else {
      const tracks = result.tracks;
      const msc = tracks[0];
      msc.setRequester(interaction.user);
      player.queue.push(msc);

      if (!player.playing) {
        interaction.reply({ content: t('commands:play.queue', { track: msc.title, author: msc.author }), ephemeral: true });
        player.play();
      }

      if(player.playing) {
        return interaction.deferReply(t('commands:play.queue', { track: msc.title, author: msc.author }));
      }
    }
  }
}