/* eslint-disable no-control-regex */
import { exec } from 'child_process';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
export default class ShellCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: 'shell',
        description: 'Shell Command',
        options: [
          {
            name: 'code',
            description: 'Code',
            type: 3,
            required: true,
          },
        ],
      },
      client,
    );
  }

  execute({ context, t }: CommandExecuteOptions) {
    if (!this.client.developers.some(x => x === context.member?.id)) {
      context.send({ content: t('commands:shell.noPerm'), flags: 1 << 6 });
      return;
    }

    exec(context.options.get('code', true).value as string, async (_err, stdout, stderr) => {
      if (!stdout && !stderr) {
        context.send({ content: t('commands:shell.noOutput'), flags: 1 << 6 });
        return;
      }

      const res = (stdout || stderr).replace(ANSI_REGEX, '');

      if (stderr) {
        await context.send({ content: `**Stderr**: \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      } else {
        await context.send({ content: `**Stdout:** \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      }
    });
  }
}
