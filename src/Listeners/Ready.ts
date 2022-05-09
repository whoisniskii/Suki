import { SukiClient } from '../SukiClient';

export default class Ready {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'ready';
  }

  execute() {
    console.log('\x1b[32m[CLIENT]\x1b[0m', `Client successfully logged in ${this.client.user?.username}#${this.client.user.discriminator}.`);

    this.client.connectLavaLink();

    if (this.client.user.id === process.env.CLIENT_TEST_ID) {
      this.client.on('rawREST', request => {
        console.log('\x1b[32m[REQUEST]\x1b[0m', `${request.method} ${request.url}, ${request.resp.statusCode}: (${this.client.requestHandler.latencyRef.latency}ms avg)`);
      });
    }
  }
}
