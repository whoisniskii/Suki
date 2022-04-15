/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import SukiClient from '../SukiClient';
import { CommandData, CommandOptions } from '../typings';

export default class Command implements CommandOptions {
  client: SukiClient;
  options: Partial<CommandOptions>;
  name: string;
  category?: string;
  data: CommandData;
  async execute(_interaction: CommandInteraction, _t: typeof globalThis.t) { }
  async executeAutoComplete(_interaction: AutocompleteInteraction, _value: string, _options?: any) { }

  constructor(options: CommandOptions, client: SukiClient) {
    this.client = client;
    this.name = options.name,
    this.category = options.category || 'Nenhuma',
    this.data = options.data;
  }
}

