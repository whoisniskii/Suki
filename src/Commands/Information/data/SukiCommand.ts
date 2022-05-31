import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class SukiData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'suki',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:suki'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:suki'),
      },
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'ping',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:suki/ping'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:suki/ping'),
          },
        },
      ],
    };
  }
}
