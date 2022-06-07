/* eslint-disable no-eval */
import { inspect } from 'util';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class EvalSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'EvalSubCommand';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: true,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const clean = (text: string) => {
      if (typeof text === 'string') {
        text
          .slice(0, 1970)
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`);
      }
      return text;
    };

    try {
      let evaled = eval(context.options.getString('code', true));

      if (evaled instanceof Promise) {
        evaled = await evaled;
      }

      context.sendMessage(
        t('command:dev/eval/output', {
          code: `\`\`\`js\n${clean(
            inspect(evaled, { depth: 0 })
              .replace(new RegExp(this.client.token as string, 'gi'), '******************')
              .slice(0, 1970),
          )}\n\`\`\``,
        }),
      );
    } catch (error: any) {
      context.sendMessage(t('command:dev/eval/error', { code: `\`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\`` }));
    }
  }
}
