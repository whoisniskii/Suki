import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'ping',
      description: '[ 📚 Information ] Shows the bot latency.',
      description_localizations: {
        'pt-BR': '[ 📚 Informação ] Veja a latência do bot.',
      },
    }, client);
  }

  async execute(context: CommandContext, t: typeof globalThis.t): Promise<void> {
    context.send(t('ping.success', { ping: this.client.shards.get(0)?.latency.toString() ?? 0 }));
  }
}