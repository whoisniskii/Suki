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

    this.config = {
      autoDefer: true,
      ephemeral: false,
      guildOnly: false,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.member?.id)) {
      context.reply({ content: t('commands:shell.noPerm'), flags: 1 << 6 });
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
      let evaled = eval(context.options.get('code', true).value as string);

      if (evaled instanceof Promise) {
        evaled = await evaled;
      }

      context.reply(
        t('commands:shell.Output', {
          code: `\`\`\`js\n${clean(
            inspect(evaled, { depth: 0 })
              .replace(new RegExp(this.client.token as string, 'gi'), '******************')
              .slice(0, 1970),
          )}\n\`\`\``,
        }),
      );
    } catch (error: any) {
      context.reply(t('commands:shell.Error', { code: `\`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\`` }));
    }
  }
}
