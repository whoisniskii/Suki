import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'ping',
        description: '[ 📚 Information ] Shows the bot latency.',
        descriptionLocalizations: {
          'pt-BR': '[ 📚 Informação ] Veja a latência do bot.',
        },
      },
      client,
    );
  }

  execute({ context, t }: CommandExecuteOptions) {
    context.send(t('ping.success', { ping: this.client.ws.ping ?? 0 }));
  }
}
