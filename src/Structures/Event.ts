import { Awaitable } from 'discord.js';
import { SukiClient } from '../SukiClient';

abstract class Event<Client = SukiClient> {
  eventName: string;

  constructor() {
    this.eventName = '';
  }

  execute(client: Client, ...args: any[]): Awaitable<any> {
    return { client, args };
  }
}

export { Event };
