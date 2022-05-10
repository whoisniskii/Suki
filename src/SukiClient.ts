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
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.request = request;
    this.database = new DatabaseManager(this);
    this.music = new PlayerHandler(this);
  }

  connectLavaLink(): void {
    this.on('rawWS', packet => this.music.handleVoiceUpdate(packet));
    this.music.start(this.user?.id as string);
  }

  initializate() {
    super.login(process.env.BOT_TOKEN);
    new CommandManager(this).loadCommands(`${__dirname}/Commands`);
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);
    new LocaleManager().loadLocales();

    process.on('uncaughtException', err => console.log(err));

    process.on('unhandledRejection', err => console.log(err));
  }
}

export { SukiClient };
