import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class UserData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'user',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:user'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user'),
      },
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'info',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/info'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/info'),
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              required: false,
              name: client.languages.languageManager.get('en-US', 'commandNames:user/info/user'),
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/info/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/info/user'),
              },
            },
          ],
        },
      ],
    };
  }
}
