import SukiClient from '../SukiClient';

export default class Ready {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'ready';
  }

  async execute() {
    console.log('\x1b[32m[CLIENT]\x1b[0m', `Client successfully logged in ${this.client.user?.tag}.`);

    this.client.connectLavaLink();
  }
}