import { ChatInputCommandInteraction, CommandInteractionOptionResolver, GuildMember, InteractionDeferReplyOptions, InteractionReplyOptions, TextChannel, VoiceState } from 'discord.js';
import { SukiClient } from '../SukiClient';

class CommandContext {
  client: SukiClient;
  interaction: ChatInputCommandInteraction;

  constructor(client: SukiClient, interaction: ChatInputCommandInteraction) {
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

  get player() {
    if (!this.guild) return null;
    return this.client.music.players.get(this.guild.id);
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

  async reply(options: InteractionReplyOptions) {
    if (this.interaction.deferred) await this.interaction.editReply(options);

    await this.interaction.reply(options);
  }

  async defer(options?: InteractionDeferReplyOptions) {
    if (this.interaction.isChatInputCommand()) await this.interaction.deferReply(options);
  }
}

export { CommandContext };
