import env from 'dotenv';
import { RegisterCommands } from './src/Managers';
import { SukiClient } from './src/SukiClient';

env.config({ path: './.env' });

const client = new SukiClient();
client.connect();

client.once('ready', () => {
  const commands = new RegisterCommands(client);
  commands.registerGlobalCommands(__dirname + '/src/Commands');
});