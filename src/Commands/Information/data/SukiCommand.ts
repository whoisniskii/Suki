import { ApplicationCommandOptionType } from 'discord.js';
import { CommandData } from '../../../Structures';
import { Suki } from '../../../Suki';

export default class SukiData extends CommandData {
  constructor(client: Suki) {
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
