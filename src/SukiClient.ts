import { Client, Constants } from 'eris';
import { Dispatcher, request } from 'undici';
import { UrlObject } from 'url';
import { PlayerHandler } from '../src/Music';
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
    super(process.env.BOT_TOKEN, {
      intents: ['guilds', 'guildMembers', 'guildMessages', 'guildMessages', 'guildVoiceStates', 'guildPresences'],
      disableEvents: {
        TYPING_START: true,
        GUILD_BAN_ADD: true,
        GUILD_BAN_REMOVE: true,
      },
      defaultImageFormat: 'png',
      defaultImageSize: Constants.ImageSizeBoundaries.MAXIMUM,
      guildCreateTimeout: 5000,
      largeThreshold: 250,
      getAllUsers: false,
      autoreconnect: true,
      allowedMentions: {
        repliedUser: false,
      },
      rest: {
        baseURL: '/api/v10',
      },
      ws: {
        followRedirects: true,
        skipUTF8Validation: true,
      },
      restMode: true,
      messageLimit: 10,
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.database = new DatabaseManager(this);
    this.request = request;
    this.music = new PlayerHandler(this);
  }

  connectLavaLink(): void {
    this.on('rawWS', packet => this.music.handleVoiceUpdate(packet));
    this.music.start(this.user.id);
  }

  initializate() {
    super.connect();
    new CommandManager(this).loadCommands(`${__dirname}/Commands`);
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);
    new LocaleManager().loadLocales();

    process.on('uncaughtException', err => console.log(err));

    process.on('unhandledRejection', err => console.log(err));
  }
}

export { SukiClient };
