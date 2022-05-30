import { ApplicationCommandOptionType } from 'discord.js';
import { AutoCompleteExecuteOptions, Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class GuildCommand extends Command {
  constructor(client: SukiClient) {
    super(client, {
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
    });

    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: false,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    switch (context.options.getSubcommand()) {
      case 'bans': {
        this.client.commands.find(x => x.rawName === 'BanInfoSubCommand')?.execute({ context, t });
        break;
      }
    }
  }

  executeAutoComplete({ interaction, value, options }: AutoCompleteExecuteOptions) {
    if (interaction.options.getSubcommand(false) === 'bans') {
      const cmd = this.client.commands.find(x => x.rawName === 'BanInfoSubCommand');
      cmd?.executeAutoComplete({ interaction, value, options });
    }
  }
}
