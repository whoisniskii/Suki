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
              name: client.languages.languageManager.get('en-US', 'commandNames:user/options/user'),
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/info/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/info/user'),
              },
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'banner',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/banner'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/banner'),
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              required: false,
              name: client.languages.languageManager.get('en-US', 'commandNames:user/options/user'),
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/banner/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/banner/user'),
              },
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'avatar',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/avatar'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/avatar'),
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              required: false,
              name: client.languages.languageManager.get('en-US', 'commandNames:user/options/user'),
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:user/avatar/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:user/avatar/user'),
              },
            },
          ],
        },
      ],
    };
  }
}
