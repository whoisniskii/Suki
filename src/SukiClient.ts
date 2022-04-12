import { Client, GatewayIntentBits } from 'discord.js';

import { EventManager, CommandManager, DatabaseManager, LocaleManager } from './Managers';

import CommandConstructor from './Structures/Command';

import PlayerManager from './Music/PlayerManager';

import dbGuild from './Database/guildDB';
import dbUser from './Database/userDB';

export default class SukiClient extends Client {
  commands: Array<CommandConstructor>;
  developers: string[];
  playerManager: PlayerManager;
  guildDB: typeof dbGuild;
  userDB: typeof dbUser;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
      ],
      failIfNotExists: false,
      allowedMentions: {
        repliedUser: false,
        parse: ['users'],
      },
    });

    this.commands = [];
    this.developers = ['847865068657836033', '600804786492932101', '680943469228982357', '343778106340802580', '431768491759239211', '689265428769669155'];
    this.guildDB = dbGuild;
    this.userDB = dbUser;
  }

  connectLavaLink(): void {
    this.playerManager = new PlayerManager(this);
    this.playerManager.startManager();
    this.on('raw', (packet) => this.playerManager.handleVoiceUpdate(packet));
  }

  connect() {
    super.login(process.env.BOT_TOKEN as string);
    new CommandManager(this).execute();
    new EventManager(this).execute();
    new DatabaseManager(this).execute();
    new LocaleManager(this).execute();
  }
}