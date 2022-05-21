/* eslint-disable no-eval */
import { ApplicationCommandOptionType } from 'discord.js';
import { inspect } from 'util';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class EvalCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'eval',
        description: client.languages.languageManager.get('en-US', 'commandDescriptions:eval'),
        descriptionLocalizations: {
          'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:eval'),
        },
        options: [
          {
            name: client.languages.languageManager.get('en-US', 'commandNames:eval/code'),
            nameLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:eval/code'),
            },
            description: client.languages.languageManager.get('en-US', 'commandDescriptions:eval/code'),
            descriptionLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:eval/code'),
            },
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      client,
    );

    this.permissions = {
      bot: [],
      user: [],
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.user.id)) {
      context.reply({ content: t('command:eval/error/noPerm'), ephemeral: true });
      return;
    }

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

      context.reply(
        t('command:eval/output', {
          code: `\`\`\`js\n${clean(
            inspect(evaled, { depth: 0 })
              .replace(new RegExp(this.client.token as string, 'gi'), '******************')
              .slice(0, 1970),
          )}\n\`\`\``,
        }),
      );
    } catch (error: any) {
      context.reply(t('command:eval/error', { code: `\`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\`` }));
    }
  }
}
