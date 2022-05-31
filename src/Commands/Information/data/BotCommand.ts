import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class BotData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'bot',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:bot'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:bot'),
      },
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'ping',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:bot/ping'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:bot/ping'),
          },
        },
      ],
    };
  }
}
