/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutocompleteInteraction } from 'eris';
import SukiClient from '../SukiClient';
import { CommandOptions } from '../typings';
import CommandContext from './CommandContext';

export default class Command implements CommandOptions {
  client: SukiClient;
  data: CommandOptions;
  name: string;
  description: string;

  async execute(_interaction: CommandContext, _t: typeof globalThis.t) { }
  async executeAutoComplete(_interaction: AutocompleteInteraction, _value: string, _options?: any) { }

  constructor(options: CommandOptions, client: SukiClient) {
    this.client = client;
    this.data = options;
    this.name = options.name;
    this.description = options.description;
  }
}

