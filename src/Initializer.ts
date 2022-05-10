import env from 'dotenv';
import { SukiClient } from './SukiClient';

env.config({ path: './.env' });

const client = new SukiClient();

client.initializate();
