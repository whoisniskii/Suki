import { CommandInteraction } from 'discord.js';
import GuildPlayer from '../../Music/Structures/GuildPlayerManager';
import CommandConstructor from '../../Structures/Command';
import SukiClient from '../../SukiClient';

export default class TestCommand extends CommandConstructor {
  constructor(client: SukiClient) {
    super({
      name: 'test',
      category: 'Dev',
      data: {
        name: 'test',
        description: 'test command',
      }
    }, client);
  }

  override async execute(interaction: CommandInteraction): Promise<void> {
    const player = new GuildPlayer(this.client, interaction);
    console.log(player.player);
  }
}