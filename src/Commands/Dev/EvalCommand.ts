/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { inspect } from 'util';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class EvalCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'eval',
      category: 'Dev',
      data: {
        name: 'eval',
        description: 'Eval command',
        options: [{
          name: 'code',
          description: 'Code to evaluate',
          type: ApplicationCommandOptionType.String,
          required: true
        }]
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction, t: typeof globalThis.t) {
    if(!this.client.developers.some(x => x === interaction.user.id)) {
      interaction.reply({ content: t('commands:shell.noPerm'), ephemeral: true });
      return;
    }

    const code = interaction.options.get('code');

    if(!code) {
      interaction.reply({ content: t('commands:shell.noCode'), ephemeral: true });
      return;
    }

    const clean = (text: string) => {
      if (text === 'string') {
        text = text.slice(0, 1970)
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`);
      }
      return text;
    };

    try {
      let evaled = eval(code.value as string);

      if (evaled instanceof Promise) {
        evaled = await evaled;
      }

      interaction.reply(t('commands:shell.Output', { code: `\`\`\`js\n${clean(inspect(evaled, { depth: 0 }).replace(new RegExp(this.client.token as string, 'gi'), '******************').slice(0, 1970))}\n\`\`\`` }));
    } catch (error: any) {
      interaction.reply(t('commands:shell.Error', { code: `\`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\`` }));
    }
  }
}