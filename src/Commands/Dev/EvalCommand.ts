import { inspect } from 'util';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class EvalCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'eval',
        description: '[ 🚀 Developers ] Evaluates a code.',
        descriptionLocalizations: {
          'pt-BR': '[ 🚀 Desenvolvedores ] Execute um código.',
        },
        options: [
          {
            name: 'code',
            nameLocalizations: {
              'pt-BR': 'código',
            },
            description: 'Code to evaluate',
            descriptionLocalizations: {
              'pt-BR': 'Código para executar',
            },
            type: 3,
            required: true,
          },
        ],
      },
      client,
    );

    this.config = {
      guildOnly: false,
    };
    this.permissions = {
      bot: [],
      user: [],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.user.id)) {
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
      let evaled = eval(context.options.getString('code', true) as string);

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
