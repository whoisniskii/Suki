import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'test',
        description: 'Test command',
        options: [
          {
            name: 'string',
            type: 3,
            description: 'text',
          },
        ],
      },
      client,
    );
  }

  execute({ context }: CommandExecuteOptions) {
    console.log(context.user);
  }
}
