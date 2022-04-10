import { RegisterCommands } from './src/Managers';
import SukiClient from './src/SukiClient';
import env from 'dotenv';

env.config({ path: './.env' });

const client = new SukiClient();
const commands = new RegisterCommands(client);
commands.registerSlashCommands();