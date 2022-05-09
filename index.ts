import env from 'dotenv';
import { SukiClient } from './src/SukiClient';

env.config({ path: './.env' });

const client = new SukiClient();

client.initializate();
