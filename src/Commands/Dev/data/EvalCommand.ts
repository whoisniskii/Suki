import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class EvalData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'eval',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:eval'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:eval'),
      },
      options: [
        {
          name: client.languages.languageManager.get('en-US', 'commandNames:eval/code'),
          nameLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:eval/code'),
          },
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:eval/code'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:eval/code'),
          },
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    };
  }
}
