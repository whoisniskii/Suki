import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { Event } from '../Structures';
import { Suki } from '../Suki';

const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

export default class MessageCreateEvent extends Event {
  eventName: string;

  constructor() {
    super();
    this.eventName = 'messageCreate';
  }

  execute(client: Suki, message: Message) {
    if (message.author.bot) return;

    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Add me')
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=1516056734967&scope=applications.commands%20bot`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    if (message.content.match(GetMention(client.user?.id as string))) {
      message.reply({ content: `Hi ${message.author}, If you need help, use the command **/help**!`, components: [row] });
    }
  }
}
