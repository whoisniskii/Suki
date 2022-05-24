import { Node, Vulkava } from 'vulkava';
import { MusixMatch } from '../Apis';
import { SukiClient } from '../SukiClient';

class PlayerHandler extends Vulkava {
  client: SukiClient;
  musixmatch: MusixMatch;

  constructor(client: SukiClient) {
    super({
      nodes: client.config.lavalink,
      sendWS(guildId, payload) {
        client.guilds.cache.get(guildId)?.shard.send(payload);
      },
      spotify: {
        clientId: client.config.vulkava.spotifyClientId,
        clientSecret: client.config.vulkava.spotifyClientSecret,
      },
      unresolvedSearchSource: 'youtube',
      defaultSearchSource: 'youtube',
    });

    this.client = client;
    this.musixmatch = new MusixMatch(this.client.config.apis.musixmatch, client);

    this.on('nodeConnect', node => {
      console.log('\x1b[32m[NODES]\x1b[0m', `Node ${node.identifier} successfully logged in.`);

      for (const player of [...this.players.values()].filter(p => p.node === node).values()) {
        const { position } = player;
        player.connect();
        player.play({ startTime: position });
      }

      setInterval(() => {
        node.send({
          op: 'ping',
        });
      }, 45000);
    });

    this.on('error', (node, error) => {
      console.log('\x1b[31m[NODES]\x1b[0m', `Error on Node ${node.identifier}.\n${error}`);
      if (error.message.startsWith('Unable to connect after')) this.reconnect(node);
    });

    this.on('nodeDisconnect', (node, code, reason) =>
      console.log('\x1b[31m[NODES]\x1b[0m', `Node ${node.identifier}. was disconnected\nClose code: ${code}.\nReason: ${reason === '' ? 'Unknown' : reason}`),
    );

    this.on('trackStart', (player, track) => {
      if (player.reconnect) {
        delete player.reconnect;
        return;
      }

      if (!player.textChannelId) return;

      const channel = this.client.channels.cache.get(player.textChannelId);
      if (!channel || channel.type !== 0) return;

      if (player.lastPlayingMsgID) {
        channel.send(player.lastPlayingMsgID).catch(() => {});
      }

      if (player.trackRepeat) return;

      channel.send(`Comecei a tocar \`${track.title}\` por \`${track.author}\``);
    });

    this.on('trackStuck', (player, track) => {
      const channel = this.client.channels.cache.get(player.textChannelId as string);
      if (!channel || channel.type !== 0) return;

      channel.send(`Ocorreu um erro ao reproduzir a música \`${track.title}\``);
      player.skip();
    });

    this.on('queueEnd', async player => {
      const channel = this.client.channels.cache.get(player.textChannelId as string);
      if (!channel || channel.type !== 0) return;

      const guildDBData = await this.client.database.getGuild(player.guildId);

      if (guildDBData?.forever) return;

      player.destroy();

      channel.send('A fila de músicas acabou, então eu saí do canal de voz.');
    });

    this.on('trackException', (player, _track, err) => {
      if (err && err.message.includes('429')) {
        const newNode = this.nodes.find(node => node.state === 1 && node !== player.node);

        if (newNode) player.moveNode(newNode);
      } else player.destroy();

      player.skip();
    });
  }

  private reconnect(node: Node) {
    node.disconnect();
    this.nodes.splice(this.nodes.indexOf(node), 1);

    const newNode = new Node(this, {
      id: node.identifier,
      hostname: node.options.hostname,
      port: node.options.port,
      password: node.options.password,
      maxRetryAttempts: node.options.maxRetryAttempts,
      retryAttemptsInterval: node.options.retryAttemptsInterval,
      secure: node.options.secure,
      region: node.options.region,
    });

    this.nodes.push(newNode);

    newNode.connect();
  }
}

export { PlayerHandler };
