import { Client, GatewayIntentBits } from 'discord.js';

import { EventManager, CommandManager, RegisterCommands, DatabaseManager, LocaleManager } from './Managers';

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
    this.developers = ['847865068657836033'];
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
    new RegisterCommands(this).registerSlashCommands();
    new DatabaseManager(this).execute();
    new LocaleManager(this).execute();
  }
}