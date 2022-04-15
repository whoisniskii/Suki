import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
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

    const button = new ButtonBuilder(
      {
        style: ButtonStyle.Link,
        label: t('events:messageCreate.button'),
        url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user?.id}&permissions=1512385670486&scope=bot%20applications.commands`
      }
    );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    if(message.content.match(GetMention(this.client.user?.id as string))) {
      message.reply({ content: t('events:messageCreate.message', { user: message.author.toString() }), components: [row] });
    }
  }
}