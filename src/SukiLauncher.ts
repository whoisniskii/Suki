import { config } from 'dotenv';
import { Suki } from './Suki';

config({ path: '../.env' });

new Suki().initialize();
