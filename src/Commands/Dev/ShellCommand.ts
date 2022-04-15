/* eslint-disable no-control-regex */
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import SukiClient from '../../SukiClient';
import { exec } from 'child_process';
import Command from '../../Structures/Command';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
export default class ShellCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: 'shell',
      category: 'Dev',
      data: {
        name: 'shell',
        description: 'Shell Command',
        options: [{
          name: 'code',
          description: 'Code',
          type: ApplicationCommandOptionType.String,
          required: true
        }]
      }
    }, client);
  }

  async execute(interaction: CommandInteraction, t: typeof globalThis.t): Promise<void> {
    if(!this.client.developers.some(x => x === interaction.user.id)) {
      interaction.reply({ content: t('commands:shell.noPerm'), ephemeral: true });
      return;
    }

    const code = interaction.options.get('code');

    if(!code) {
      interaction.reply({ content: t('commands:shell.noCode'), ephemeral: true });
      return;
    }

    exec(code?.value as string, async (_err, stdout, stderr) => {
      if (!stdout && !stderr) {
        interaction.reply({ content: t('commands:shell.noOutput'), ephemeral: true });
        return;
      }

      const res = (stdout || stderr).replace(ANSI_REGEX, '');

      if (stderr) {
        await interaction.reply({ content: `**Stderr**: \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      }
      else {
        await interaction.reply({ content: `**Stdout:** \`\`\`sh\n${res.slice(0, 1970)}\n\`\`\`` });
      }
    });
  }
}