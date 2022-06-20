import { ChatInputCommandInteraction, GuildMember, InteractionReplyOptions, TextChannel } from 'discord.js';
import { Suki } from '../Suki';

class CommandContext {
  client: Suki;
  interaction: ChatInputCommandInteraction;

  constructor(client: Suki, interaction: ChatInputCommandInteraction) {
    this.client = client;
    this.interaction = interaction;
  }

  get user() {
    return this.interaction.user;
  }

  get member() {
    return this.interaction.member as GuildMember;
  }

  get guild() {
    return this.interaction.guild;
  }

  get channel() {
    return this.interaction.channel as TextChannel;
  }

  get options() {
    return this.interaction.options;
  }

  get voice() {
    return this.member.voice;
  }

  get database() {
    return this.client.database;
  }

  async sendMessage(options: InteractionReplyOptions | string) {
    if (this.interaction.deferred) {
      await this.interaction.editReply(options);
    } else await this.interaction.reply(options);

    return { options };
  }
}

export { CommandContext };
