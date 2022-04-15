/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutocompleteInteraction } from 'eris';
import SukiClient from '../SukiClient';
import { CommandData, CommandOptions } from '../typings';
import CommandContext from './CommandContext';

export default class Command implements CommandOptions {
  client: SukiClient;
  options: Partial<CommandOptions>;
  name: string;
  category?: string;
  data: CommandData;
  async execute(_interaction: CommandContext, _t: typeof globalThis.t) { }
  async executeAutoComplete(_interaction: AutocompleteInteraction, _value: string, _options?: any) { }

  constructor(options: CommandOptions, client: SukiClient) {
    this.client = client;
    this.name = options.name,
    this.category = options.category || 'Nenhuma',
    this.data = options.data;
  }
}

