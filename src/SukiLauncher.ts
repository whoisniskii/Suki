import { config } from 'dotenv';
import { Suki } from './Suki';

config({ path: '../.env' });

new Suki(process.env.BOT_TOKEN as string).initialize();
