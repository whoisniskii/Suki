/* eslint-disable no-await-in-loop */
import { readdirSync } from 'fs';
import { SukiClient } from '../SukiClient';
import { Event } from '../Structures';

class EventManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async loadEvents(path: string) {
    const eventFiles = readdirSync(path);

    for (const file of eventFiles) {
      if (!file.endsWith('.js')) continue;

      const { default: EventClass }: { default: new () => Event } = await import(`${path}/${file}`);
      const event = new EventClass();
      this.client.on(event.eventName, (...args: any[]) => event.execute(this.client, ...args));
    }

    console.log('\x1b[32m[EVENTS]\x1b[0m', 'Events loaded successfully.');
  }
}

export { EventManager };
