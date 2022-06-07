import type { ChatInputApplicationCommandData } from 'discord.js';
import type { Suki } from '../Suki';

abstract class CommandData<Client = Suki> {
  data: ChatInputApplicationCommandData;
  constructor(client: Client);

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}
}

export { CommandData };
