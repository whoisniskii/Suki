/* eslint-disable no-control-regex */
import { exec } from 'child_process';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class ShellSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'ShellSubCommand';
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
        context.sendMessage({ content: t('command:dev/shell/error/noOutput'), ephemeral: true });
        return;
      }

      const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

      const res = (stdout || stderr).replace(ANSI_REGEX, '');

      if (stderr) {
        await context.sendMessage({ content: `**Stderr**: \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      } else await context.sendMessage({ content: `**Stdout:** \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
    });
  }
}
