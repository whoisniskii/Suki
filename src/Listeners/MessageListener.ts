import { Message } from 'discord.js';
import { getFixedT } from 'i18next';
import { SukiClient } from '../SukiClient';
import { Event } from '../Structures';

export default class MessageCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'messageCreate';
  }

  async execute(client: SukiClient, message: Message) {
    if (message.author.bot) return;

    const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

    const userDBData = await client.database.getUser(message.author.id);

    const t = getFixedT(userDBData?.locale || 'en-US');

    if (message.content.match(GetMention(client.user?.id as string))) {
      message.reply({ content: t('events:messageCreate.message', { user: message.author.toString() }) });
    }
  }
}
