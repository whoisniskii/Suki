import { Message } from 'eris';
import { getFixedT } from 'i18next';
import { SukiClient } from '../SukiClient';

export default class MessageCreate {
  client: SukiClient;
  name: string;

  constructor(client: SukiClient) {
    this.client = client;
    this.name = 'messageCreate';
  }

  async execute(message: Message) {
    if (message.author.bot) return;

    const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

    const userDBData = await this.client.database.getUser(message.author.id);

    const t = getFixedT(userDBData?.locale || 'en-US');

    if (message.content.match(GetMention(this.client.user?.id as string))) {
      this.client.createMessage(message.channel.id, { content: t('events:messageCreate.message', { user: message.author.mention.toString() }) });
    }
  }
}
