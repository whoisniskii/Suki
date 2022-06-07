import { ApplicationCommandOptionType } from 'discord.js';
import { CommandData } from '../../../Structures';
import { Suki } from '../../../Suki';

export default class ServerData extends CommandData {
  constructor(client: Suki) {
    super(client);
    this.data = {
      name: 'server',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:server'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:server'),
      },
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'bans',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:server/bans'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:server/bans'),
          },
          options: [
            {
              autocomplete: true,
              required: true,
              type: ApplicationCommandOptionType.String,
              name: client.languages.languageManager.get('en-US', 'commandNames:server/bans/user'),
              nameLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:server/bans/user'),
              },
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:server/bans/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:server/bans/user'),
              },
            },
          ],
        },
      ],
    };
  }
}
