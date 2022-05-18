import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { SukiClient } from '../SukiClient';
import { Event } from '../Structures';

export default class MessageCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'messageCreate';
  }

  execute(client: SukiClient, message: Message) {
    if (message.author.bot) return;

    const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Add me')
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=271641686&scope=applications.commands%20bot`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    if (message.content.match(GetMention(client.user?.id as string))) {
      message.reply({ content: `Hi ${message.author}, If you need help, use the command **/help**!`, components: [row] });
    }
  }
}
