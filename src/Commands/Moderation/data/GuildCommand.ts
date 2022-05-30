import { ApplicationCommandOptionType } from 'discord.js';
import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class ServerData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'guild',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:guild'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:guild'),
      },
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'bans',
          description: client.languages.languageManager.get('en-US', 'commandDescriptions:guild/bans'),
          descriptionLocalizations: {
            'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:guild/bans'),
          },
          options: [
            {
              autocomplete: true,
              required: true,
              type: ApplicationCommandOptionType.String,
              name: client.languages.languageManager.get('en-US', 'commandNames:guild/bans/user'),
              nameLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:guild/bans/user'),
              },
              description: client.languages.languageManager.get('en-US', 'commandDescriptions:guild/bans/user'),
              descriptionLocalizations: {
                'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:guild/bans/user'),
              },
            },
          ],
        },
      ],
    };
  }
}
