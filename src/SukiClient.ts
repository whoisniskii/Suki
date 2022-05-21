import { Client, GatewayIntentBits } from 'discord.js';
import { Dispatcher, request } from 'undici';
import { UrlObject } from 'url';
import config from './Config/config';
import { CommandManager, DatabaseManager, EventManager } from './Managers';
import { PlayerHandler } from './Music';
import { Command, Language } from './Structures';

class SukiClient extends Client {
  config: typeof config;
  commands: Array<Command>;
  developers: string[];
  music: PlayerHandler;
  database: DatabaseManager;
  languages: Language;
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
      presence: {
        status: 'idle',
      },
    });

    this.commands = [];
    this.developers = ['847865068657836033'];
    this.request = request;
    this.config = config;
    this.database = new DatabaseManager(this);
    this.music = new PlayerHandler(this);
    this.languages = new Language(this);
  }

  connectLavaLink(): void {
    this.on('raw', packet => this.music.handleVoiceUpdate(packet));
    this.music.start(this.user?.id as string);
  }

  initializate() {
    super.login(this.config.client.token);
    new CommandManager(this).loadCommands(`${__dirname}/Commands`);
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);

    process.on('uncaughtException', err => console.log(err));

    process.on('unhandledRejection', err => console.log(err));
  }
}

export { SukiClient };
