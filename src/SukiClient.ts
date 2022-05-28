import { Client, ClientUser, GatewayIntentBits } from 'discord.js';
import { setTimeout as sleep } from 'timers/promises';
import { Dispatcher, request } from 'undici';
import { UrlObject } from 'url';
// @ts-ignore
import config from './Config/config';
import { CommandManager, DatabaseManager, EventManager } from './Managers';
import { PlayerHandler } from './Music';
import { Command, Language } from './Structures';
import Logger from './Utils/Logger';

class SukiClient extends Client {
  config: typeof config;
  languages: Language;
  database: DatabaseManager;
  music: PlayerHandler;
  commands: Command[];
  developers: string[];
  logger: Logger;
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

    this.config = config;
    this.request = request;
    this.logger = new Logger();
    this.languages = new Language(this);
    this.database = new DatabaseManager(this);
    this.music = new PlayerHandler(this);
    this.commands = [];
    this.developers = ['847865068657836033'];
  }

  connectLavaLink() {
    this.on('raw', packet => this.music.handleVoiceUpdate(packet));
    this.music.start((this.user as ClientUser).id);
  }

  async initialize() {
    await sleep(1000);
    new CommandManager(this).loadCommands(`${__dirname}/Commands`);
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);
    super.login(this.config.client.token);

    process.on('uncaughtException', err => this.logger.error(err.message));
    process.on('unhandledRejection', err => this.logger.error(err as string));
  }
}

export { SukiClient };
