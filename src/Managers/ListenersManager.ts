import { readdirSync } from 'fs';
import SukiClient from '../SukiClient';

class EventManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async execute() {
    console.log('\x1b[32m[EVENTS]\x1b[0m', 'Events loaded successfully.');

    this.loadEvents();
  }

  async loadEvents() {
    const eventFiles = readdirSync('src/Listeners');
    for (const file of eventFiles) {
      await import(`../Listeners/${file}`).then((_listener) => {
        const event = new _listener.default(this.client);
        this.client.on(event.name, (...args) => event.execute(...args));
      });
    }
  }
}

export { EventManager };