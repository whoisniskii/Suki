import { EnumResolvers, Message, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import i18next from 'i18next';
import SukiClient from '../SukiClient';

export default class MessageCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'messageCreate';
  }

  async execute(message: Message) {
    if(!message.guild || message.author.bot) return;

    const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

    const t = global.t = i18next.getFixedT('en-US');

    const button = new ButtonBuilder()
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user?.id}&permissions=1512385670486&scope=bot%20applications.commands`)
      .setLabel(t('events:messageCreate.button'))
      .setStyle(EnumResolvers.resolveButtonStyle('LINK'));

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);

    if(message.content.match(GetMention(this.client.user?.id as string))) {
      message.reply({ content: t('events:messageCreate.message', { user: message.author.toString() }), components: [row] });
    }
  }
}