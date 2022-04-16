import { Client } from 'eris';
import { request, Dispatcher } from 'undici';
import { UrlObject } from 'url';

import { EventManager, CommandManager, DatabaseManager, LocaleManager } from './Managers';

import Command from './Structures/Command';

import PlayerManager from './Music/PlayerManager';

import dbGuild from './Database/guildDB';
import dbUser from './Database/userDB';

export default class SukiClient extends Client {
  commands: Array<Command>;
  developers: string[];
  playerManager: PlayerManager;
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
      allowedMentions: {
        repliedUser: false,
      },
      restMode: true,
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.guildDB = dbGuild;
    this.userDB = dbUser;
    this.request = request;
  }

  connectLavaLink(): void {
    this.playerManager = new PlayerManager(this);
    this.playerManager.startManager();
    this.on('rawWS', (packet) => this.playerManager.handleVoiceUpdate(packet));
  }

  login() {
    super.connect();
    new CommandManager(this).loadCommands(__dirname + '/Commands');
    new EventManager(this).loadEvents(__dirname + '/Listeners');
    new DatabaseManager(this).execute();
    new LocaleManager(this).execute();
  }
}