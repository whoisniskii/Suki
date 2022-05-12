import { Client, GatewayIntentBits } from 'discord.js';
import { Dispatcher, request } from 'undici';
import { UrlObject } from 'url';
import { PlayerHandler } from './Music';
import { CommandManager, DatabaseManager, EventManager, LocaleManager } from './Managers';
import { Command } from './Structures';

class SukiClient extends Client {
  commands: Array<Command>;
  developers: string[];
  music: PlayerHandler;
  database: DatabaseManager;
  request: (
    url: string | URL | UrlObject,
    options?: { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>>,
  ) => Promise<Dispatcher.ResponseData>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
      failIfNotExists: false,
      allowedMentions: {
        parse: ['users'],
        repliedUser: false,
      },
      shards: 'auto',
      presence: {
        status: 'idle',
        afk: false,
      },
      shardCount: 1,
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.request = request;
    this.database = new DatabaseManager(this);
    this.music = new PlayerHandler(this);
  }

  connectLavaLink(): void {
    this.on('raw', packet => this.music.handleVoiceUpdate(packet));
    this.music.start(this.user?.id as string);
  }

  initializate() {
    super.login(process.env.BOT_TOKEN);
    new CommandManager(this).loadCommands(`${__dirname}/Commands`);
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);
    new LocaleManager().loadLocales();

    process.on('uncaughtException', err => console.log(err));

    process.on('unhandledRejection', err => console.log(err));

    if (this.user?.id === process.env.CLIENT_TEST_ID) {
      this.rest.on('request', _request => console.log('\x1b[32m[REQUEST]\x1b[0m', `${_request.method} ${_request.path}`));
      this.rest.on('response', (_req, response) => console.log('\x1b[32m[RESPONSE]\x1b[0m', `${_req.method} ${_req.path}, ${response.status}: (${this.ws.ping}ms avg)`));
    }
  }
}

export { SukiClient };
