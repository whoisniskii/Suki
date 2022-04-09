import SukiClient from './src/SukiClient';
import env from 'dotenv';

env.config({ path: './.env' });

const client = new SukiClient();

client.connect();

process.on('uncaughtException', (err) => console.log(err));

process.on('unhandledRejection', (err) => console.log(err));