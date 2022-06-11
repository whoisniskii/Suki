import { ApplicationCommandOptionType } from 'discord.js';
import { CommandData } from '../../../Structures';
import { Suki } from '../../../Suki';

export default class DevData extends CommandData {
  constructor(client: Suki) {
    super(client);
    this.data = {
      name: client.languages.languageManager.get('en-US', 'commandNames:dev'),
      nameLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:dev'),
      },
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:dev'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:dev'),
      },
      dmPermission: false,
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'eval',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:dev/eval'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:dev/eval'),
          },
          options: [
            {
              name: client.languages.languageManager.get('en-US', 'commandNames:dev/shell/code'),
              nameLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:dev/shell/code'),
              },
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:dev/eval/code'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:dev/eval/code'),
              },
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'shell',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:dev/shell'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:dev/shell'),
          },
          options: [
            {
              name: client.languages.languageManager.get('en-US', 'commandNames:dev/shell/code'),
              nameLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:dev/shell/code'),
              },
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:dev/shell/code'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:dev/shell/code'),
              },
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
      ],
    };
  }
}
