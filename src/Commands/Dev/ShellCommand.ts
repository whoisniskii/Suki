/* eslint-disable no-control-regex */
import { exec } from 'child_process';
import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export default class ShellCommand extends Command {
  constructor(client: SukiClient) {
    super(client);

    this.rawName = 'shell';
    this.permissions = {
      bot: [],
      user: [],
    };
    this.config = {
      registerSlashCommands: true,
      devOnly: true,
    };
  }

  execute({ context, t }: CommandExecuteOptions) {
    exec(context.options.getString('code', true), async (_err, stdout, stderr) => {
      if (!stdout && !stderr) {
        context.reply({ content: t('command:shell/error/noOutput'), ephemeral: true });
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
