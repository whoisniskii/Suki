import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'ping',
      description: 'mostra o ping do bot',
    }, client);
  }

  async execute(context: CommandContext, t: typeof globalThis.t): Promise<void> {
    context.send(t('ping.success', { ping: this.client.shards.get(0)?.latency.toString() ?? 0 }));
  }
}