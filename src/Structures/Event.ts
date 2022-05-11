import type { Awaitable } from 'discord.js';
import { SukiClient } from '../SukiClient';

class Event {
  eventName: string;

  constructor() {
    this.eventName = '';
  }

  execute(client: SukiClient, ...args: any[]): Awaitable<any> {
    return { client, args };
  }
}

export { Event };
