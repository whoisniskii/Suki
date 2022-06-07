import { ChatInputCommandInteraction, CommandInteractionOptionResolver, GuildMember, InteractionReplyOptions, TextChannel, VoiceState } from 'discord.js';
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
    return (this.interaction.member as GuildMember) ?? this.client.guilds.cache.get(this.interaction.guildId as string)?.members.cache.get(this.interaction.user.id);
  }

  get guild() {
    return this.interaction.guild ?? this.client.guilds.cache.get(this.interaction.guildId as string);
  }

  get channel() {
    return this.interaction.channel as TextChannel;
  }

  get options() {
    return this.interaction.options as CommandInteractionOptionResolver;
  }

  get voice() {
    return this.member.voice as VoiceState;
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

  async defer() {
    if (this.interaction.isChatInputCommand()) {
      await this.interaction.deferReply();
    }
  }
}

export { CommandContext };
