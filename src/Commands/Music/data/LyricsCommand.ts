import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class LyricsData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: client.languages.languageManager.get('en-US', 'commandNames:lyrics'),
      nameLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:lyrics'),
      },
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:lyrics'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:lyrics'),
      },
      options: [
        {
          name: client.languages.languageManager.get('en-US', 'commandNames:lyrics/song'),
          nameLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:lyrics/song'),
          },
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:lyrics/song'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:lyrics/song'),
          },
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: client.languages.languageManager.get('en-US', 'commandNames:lyrics/artist'),
          nameLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:lyrics/artist'),
          },
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:lyrics/artist'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:lyrics/artist'),
          },
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    };
  }
}
