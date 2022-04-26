/* eslint-disable @typescript-eslint/no-explicit-any */
import SukiClient from '../SukiClient';
import { Vulkava, Node } from 'vulkava';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import MusixMatch from '../APIS/Musixmatch';

const env = yaml.load(readFileSync('./nodes.yml', 'utf8')) as any;

export default class PlayerHandler extends Vulkava {
  client: SukiClient;
  musixmatch: MusixMatch;

  constructor(client: SukiClient) {
    super({
      nodes: env.lavalinkNodes,
      sendWS(guildId, payload) {
        client.guilds.get(guildId)?.shard.sendWS(payload.op, payload.d);
      },
      spotify: {
        clientId: process.env.SPOTIFYCLIENTID,
        clientSecret: process.env.SPOTIFYCLIENTSECRET,
      },
      unresolvedSearchSource: 'youtube'
    });

    this.client = client;
    this.musixmatch = new MusixMatch(process.env.MUSIXMATCH_API_KEY, client);

    this.on('nodeConnect', async (node): Promise<void> => {
      console.log('\x1b[32m[NODES]\x1b[0m', `Node ${node.identifier} successfully logged in.`);

      for (const player of [...this.players.values()].filter(p => p.node === node).values()) {
        const position = player.position;
        player.connect();
        player.play({ startTime: position });
      }

      setInterval(() => {
        node.send({
          op: 'ping',
        });
      }, 45000);
    });

    this.on('error', (node, error): void => {
      console.log('\x1b[31m[NODES]\x1b[0m', `Error on Node ${node.identifier}.\n${error}`);
      if (error.message.startsWith('Unable to connect after')) this.reconnect(node);
    });

    this.on('nodeDisconnect', (node, code, reason): void => {
      console.log('\x1b[31m[NODES]\x1b[0m', `Node ${node.identifier}. was disconnected\nClose code: ${code}.\nReason: ${reason === '' ? 'Unknown' : reason}`);
    });

    this.on('trackStart', async (player, track): Promise<void> => {
      if (player.reconnect) {
        delete player.reconnect;
        return;
      }

      if (!player.textChannelId) return;

      const channel = this.client.getChannel(player.textChannelId);
      if (!channel || channel.type !== 0) return;

      if (player.lastPlayingMsgID) {
        channel.deleteMessage(player.lastPlayingMsgID).catch(() => { });
      }

      if(player.trackRepeat === true) {
        return;
      }

      await channel.createMessage(`Comecei a tocar \`${track.title}\` por \`${track.author}\``);
    });

    this.on('trackStuck', async (player, track): Promise<void> => {
      const channel = this.client.getChannel(player.textChannelId as string);
      if (!channel || channel.type !== 0) return;

      await channel.createMessage(`Ocorreu um erro ao reproduzir a música \`${track.title}\``);
      player.skip();
    });

    this.on('queueEnd', async (player): Promise<void> => {
      const channel = this.client.getChannel(player.textChannelId as string);
      if (!channel || channel.type !== 0) return;

      const guildDBData = await this.client.database.getGuild(player.guildId);

      if(guildDBData?.forever) return;

      player.destroy();

      await channel.createMessage('A fila de músicas acabou, então eu saí do canal de voz.');
    });

    this.on('trackException', async (player, _track, err): Promise<void> => {
      if (err && err.message.includes('429')) {
        const newNode = this.nodes.find(node => node.state === 1 && node !== player.node);

        if (newNode) player.moveNode(newNode);
      } else {
        player.destroy();
      }

      player.skip();
    });
  }

  private reconnect(node: Node) {
    node.disconnect();
    this.nodes.splice(this.nodes.indexOf(node), 1);

    const newNode = new Node(this, {
      id: node.identifier as string,
      hostname: node.options.hostname,
      port: node.options.port,
      password: node.options.password,
      maxRetryAttempts: 10,
      retryAttemptsInterval: 3000,
      secure: false,
      region: node.options.region
    });

    this.nodes.push(newNode);

    newNode.connect();
  }
}