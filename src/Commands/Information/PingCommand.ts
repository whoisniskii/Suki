import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'ping',
        description: client.languages.languageManager.get('en-US', 'commandDescriptions:ping'),
        descriptionLocalizations: {
          'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:ping'),
        },
      },
      client,
    );

    this.permissions = {
      bot: [],
      user: [],
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    context.reply(t('command:ping/success', { ping: this.client.ws.ping.toString() }));
  }
}
