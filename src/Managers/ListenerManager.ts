/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
import { readdirSync } from 'fs';
import { SukiClient } from '../SukiClient';

class EventManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async loadEvents(path: string) {
    const eventFiles = readdirSync(path);
    for (const file of eventFiles) {
      await import(`${path}/${file}`).then(listener => {
        const event = new listener.default(this.client);
        this.client.on(event.name, (...args) => event.execute(...args));
      });
    }

    console.log('\x1b[32m[EVENTS]\x1b[0m', 'Events loaded successfully.');
  }
}

export { EventManager };
