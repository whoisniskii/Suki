import { CommandInteraction } from 'discord.js';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class TestCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'test',
      category: 'Developer',
      data: {
        name: 'test',
        description: 'test command',
        options: []
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction, t: typeof globalThis.t): Promise<void> {
    console.log(t);
    interaction.reply(t('commands:test.success'));
  }
}