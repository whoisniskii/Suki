import { Message } from 'eris';
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
    if(message.author.bot) return;

    const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

    const userDBData = await this.client.userDB.findOne({ id: message.author.id });

    if(!userDBData) {
      await this.client.userDB.create({
        id: message.author.id,
        locale: 'en-US'
      });
    }

    const t = global.t = i18next.getFixedT('en-US');

    if(message.content.match(GetMention(this.client.user?.id as string))) {
      this.client.createMessage(message.channel.id, { content: t('events:messageCreate.message', { user: message.author.mention.toString() }) });
    }
  }
}