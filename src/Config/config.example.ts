import type { NodeOptions } from 'vulkava';

export default {
  client: {
    token: 'BOT TOKEN',
    id: 'CLIENT ID',
    guild: 'GUILD TEST ID',
  },
  database: {
    mongodb: 'MONGODB URI',
  },
  vulkava: {
    spotifyClientId: 'SPOTIFY API CLIENT ID',
    spotifyClientSecret: 'SPOTIFY API CLIENT SECRET',
  },
  apis: {
    musixmatch: 'MUSIXMATCH API KEY',
  },
  lavalink: [
    {
      id: 'Node 1',
      hostname: 'localhost',
      port: 2333,
      password: 'youshallnotpass',
    },
  ] as NodeOptions[],
};