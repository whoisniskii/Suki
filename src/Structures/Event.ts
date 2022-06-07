import { Awaitable } from 'discord.js';
import { Suki } from '../Suki';

abstract class Event<Client = Suki> {
  eventName: string;

  constructor() {
    this.eventName = '';
  }

  execute(client: Client, ...args: any[]): Awaitable<any> {
    return { client, args };
  }
}

export { Event };
