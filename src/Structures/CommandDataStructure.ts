import type { ChatInputApplicationCommandData } from 'discord.js';
import type { SukiClient } from '../SukiClient';

class CommandDataStructure {
  data: ChatInputApplicationCommandData;
  constructor(client: SukiClient);

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}
}

export { CommandDataStructure };
