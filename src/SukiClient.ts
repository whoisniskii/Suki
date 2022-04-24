import { Client, Constants } from 'eris';
import { request, Dispatcher } from 'undici';
import { UrlObject } from 'url';

import { EventManager, CommandManager, DatabaseManager, LocaleManager } from './Managers';

import Command from './Structures/Command';
import PlayerHandler from './Music/PlayerHandler';
import dbGuild from './Database/guildDB';
import dbUser from './Database/userDB';

export default class SukiClient extends Client {
  commands: Array<Command>;
  developers: string[];
  music: PlayerHandler;
  guildDB: typeof dbGuild;
  userDB: typeof dbUser;
  request: (
    url: string | URL | UrlObject,
    options?: { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & Partial<Pick<Dispatcher.RequestOptions, 'method'>>,
  ) => Promise<Dispatcher.ResponseData>;

  constructor() {
    super(process.env.BOT_TOKEN, {
      intents: [
        'guilds',
        'guildMembers',
        'guildMessages',
        'guildMessages',
        'guildVoiceStates',
        'guildPresences'
      ],
      disableEvents: {
        'TYPING_START': true,
        'GUILD_BAN_ADD': true,
        'GUILD_BAN_REMOVE': true,

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
        baseURL: '/api/v10'
      },
      ws: {
        followRedirects: true,
        skipUTF8Validation: true
      },
      restMode: true,
      messageLimit: 10
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.guildDB = dbGuild;
    this.userDB = dbUser;
    this.request = request;
    this.music = new PlayerHandler(this);
  }

  connectLavaLink(): void {
    this.on('rawWS', (packet) => this.music.handleVoiceUpdate(packet));
    this.music.start(this.user.id);
  }

  initializate() {
    super.connect();
    new CommandManager(this).loadCommands(__dirname + '/Commands');
    new EventManager(this).loadEvents(__dirname + '/Listeners');
    new DatabaseManager().loaderDatabase();
    new LocaleManager().loadLocales();

    this.on('rawREST', (request) => {
      console.log('\x1b[32m[REQUEST]\x1b[0m', `${request.method} ${request.url}, ${request.resp.statusCode}: (${this.requestHandler.latencyRef.latency}ms avg)`);
    });
  }
}