/* eslint-disable no-control-regex */
import { exec } from 'child_process';
import { ApplicationCommandOptionType } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
export default class ShellCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'shell',
        description: client.languages.languageManager.get('en-US', 'commandDescriptions:shell'),
        descriptionLocalizations: {
          'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:shell'),
        },
        options: [
          {
            name: client.languages.languageManager.get('en-US', 'commandNames:shell/code'),
            nameLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandNames:shell/code'),
            },
            description: client.languages.languageManager.get('en-US', 'commandDescriptions:shell/code'),
            descriptionLocalizations: {
              'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:shell/code'),
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

  execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.member?.id)) {
      context.reply({ content: t('command:shell/error/noPerm'), flags: 1 << 6 });
      return;
    }

    exec(context.options.getString('code', true), async (_err, stdout, stderr) => {
      if (!stdout && !stderr) {
        context.reply({ content: t('command:shell/error/noOutput'), flags: 1 << 6 });
        return;
      }

      const res = (stdout || stderr).replace(ANSI_REGEX, '');

      if (stderr) {
        await context.reply({ content: `**Stderr**: \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      } else {
        await context.reply({ content: `**Stdout:** \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      }
    });
  }
}
