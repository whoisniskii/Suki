import env from 'dotenv';
import { RegisterCommands } from './src/Structures';
import { SukiClient } from './src/SukiClient';

env.config({ path: './.env' });

const client = new SukiClient();
client.connect();

client.once('ready', () => {
  const commands = new RegisterCommands(client);
  commands.registerSlashCommands(`${__dirname}/src/Commands`);
});
