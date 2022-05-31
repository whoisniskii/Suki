/* eslint-disable no-await-in-loop */
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { setTimeout as sleep } from 'timers/promises';
// @ts-ignore
import config from './Config/config';
import { DatabaseManager, EventManager } from './Managers';
import { Command, CommandDataStructure, Language } from './Structures';
import Logger from './Utils/Logger';

class SukiClient extends Client {
  config: typeof config;
  languages: Language;
  database: DatabaseManager;
  commands: Collection<string, Command>;
  developers: string[];
  logger: Logger;

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
    this.logger = new Logger();
    this.languages = new Language(this);
    this.database = new DatabaseManager(this);
    this.commands = new Collection();
    this.developers = ['847865068657836033'];
  }

  async loadCommands(client: SukiClient) {
    const categories = await readdir('./Commands/');
    for (const category of categories) {
      const commands = await readdir(`./Commands/${category}`);

      for (const command of commands) {
        if (!command.endsWith('.js')) continue;
        const commandWithoutExtension = command.replace('.js', '');
        const { default: CommandClass }: { default: new (_client: SukiClient) => Command } = await import(`./Commands/${category}/${command}`);
        const cmd = new CommandClass(client);
        client.commands.set(commandWithoutExtension, cmd);
      }
    }

    this.logger.info('Commands loaded successfully.', 'COMMANDS');
  }

  async loadCommandData(client: SukiClient) {
    const categories = await readdir('./Commands/');
    for (const category of categories) {
      const commands = await readdir(`./Commands/${category}/data`);

      for (const command of commands) {
        if (!command.endsWith('.js')) continue;
        const commandDataWithoutExtension = command.replace('.js', '');

        const { default: CommandDataClass }: { default: new (_client: SukiClient) => CommandDataStructure } = await import(`./Commands/${category}/data/${command}`);
        const cachedCommand = client.commands.get(commandDataWithoutExtension);
        cachedCommand?.addOptions(new CommandDataClass(client).data);
      }
    }

    this.logger.info('Data loaded successfully.', 'COMMANDS');
  }

  async initialize() {
    new EventManager(this).loadEvents(`${__dirname}/Listeners`);
    this.loadCommands(this);
    await sleep(2500);
    this.loadCommandData(this);
    await sleep(2500);
    super.login(this.config.client.token);

    process.on('uncaughtException', err => this.logger.error(err.message));
    process.on('unhandledRejection', err => this.logger.error(err as string));
  }
}

export { SukiClient };
