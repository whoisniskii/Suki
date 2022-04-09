import SukiClient from './src/SukiClient';
import env from 'dotenv';

env.config({ path: './.env' });

const client = new SukiClient();

client.connect();

process.on('uncaughtException', (err) => console.error(err));

process.on('unhandledRejection', (err) => console.error(err));