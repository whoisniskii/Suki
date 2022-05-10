import type { Awaitable } from 'discord.js';
import { SukiClient } from '../SukiClient';

class Event {
  eventName: string;

  constructor() {
    this.eventName = '';
  }

  execute(client: SukiClient, ...rest: any[]): Awaitable<any> {
    return { client, rest };
  }
}

export { Event };
