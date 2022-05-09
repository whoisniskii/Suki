/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from 'util';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class EvalCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'eval',
        description: 'Eval command',
        options: [
          {
            name: 'code',
            description: 'Code to evaluate',
            type: 3,
            required: true,
          },
        ],
      },
      client,
    );
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.member?.id)) {
      context.send({ content: t('commands:shell.noPerm'), flags: 1 << 6 });
      return;
    }

    const clean = (text: string) => {
      if (text === 'string') {
        text
          .slice(0, 1970)
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`);
      }
      return text;
    };

    try {
      let evaled = eval(context.options.join(' '));

      if (evaled instanceof Promise) {
        evaled = await evaled;
      }

      context.send(
        t('commands:shell.Output', { code: `\`\`\`js\n${clean(inspect(evaled, { depth: 0 }).replace(new RegExp(process.env.BOT_TOKEN, 'gi'), '******************').slice(0, 1970))}\n\`\`\`` }),
      );
    } catch (error: any) {
      context.send(t('commands:shell.Error', { code: `\`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\`` }));
    }
  }
}
