import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class PlayData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: client.languages.languageManager.get('en-US', 'commandNames:play'),
      nameLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:play'),
      },
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:play'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:play'),
      },
      options: [
        {
          name: client.languages.languageManager.get('en-US', 'commandNames:play/song'),
          nameLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:play/song'),
          },
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:play/song'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:play/song'),
          },
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    };
  }
}
