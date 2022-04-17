import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'test',
      description: 'Test command',
      options: [
        {
          name: 'string',
          type: 3,
          description: 'text',
        }
      ]
    }, client);
  }

  async execute(context: CommandContext): Promise<void> {
    console.log(context.user);
  }
}