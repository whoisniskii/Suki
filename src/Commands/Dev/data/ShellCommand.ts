import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class ShellData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'shell',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:shell'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:shell'),
      },
      options: [
        {
          name: client.languages.languageManager.get('en-US', 'commandNames:shell/code'),
          nameLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:shell/code'),
          },
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:shell/code'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:shell/code'),
          },
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    };
  }
}
