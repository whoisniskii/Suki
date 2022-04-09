import { Client, GatewayIntentBits } from 'discord.js';
import { EventManager, CommandManager, RegisterCommands } from './Managers';
import CommandConstructor from './Structures/Command';
import PlayerManager from './Music/PlayerManager';

export default class SukiClient extends Client {
  commands: Array<CommandConstructor>;
  developers: string[];
  playerManager: PlayerManager;

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
  }

  connectLavaLink(): void {
    this.playerManager = new PlayerManager(this);
    this.playerManager.startManager();
    this.on('raw', (packet) => this.playerManager.handleVoiceUpdate(packet));
  }

  connect() {
    new CommandManager(this).execute();
    new EventManager(this).execute();
    new RegisterCommands(this).registerSlashCommands();
    super.login(process.env.BOT_TOKEN);
  }
}