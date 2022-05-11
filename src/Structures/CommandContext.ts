/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ChatInputCommandInteraction,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  InteractionDeferReplyOptions,
  InteractionReplyOptions,
  LocalizationMap,
  TextChannel,
  User,
  VoiceState,
} from 'discord.js';
import { Player } from 'vulkava';
import { SukiClient } from '../SukiClient';
import { MusixMatch } from '../APIS';

class CommandContext {
  client: SukiClient;
  interaction: ChatInputCommandInteraction;

  constructor(client: SukiClient, options: CommandContextOptions) {
    this.client = client;
    this.interaction = options.interaction;
  }

  get user(): User {
    return this.interaction.user;
  }

  get userLocale(): LocalizationMap {
    return this.interaction.locale as LocalizationMap;
  }

  get guildLocale(): LocalizationMap {
    return this.interaction.guildLocale as LocalizationMap;
  }

  get member(): GuildMember | null | undefined {
    return this.interaction.member as GuildMember;
  }

  get guild(): Guild {
    return this.interaction.guild as Guild;
  }

  get channel(): TextChannel | GuildTextBasedChannel {
    return this.interaction.channel as TextChannel;
  }

  get player(): Player {
    return (this.client.music.players.get(this.guild.id) as Player) || null;
  }

  get application(): CommandInteraction {
    return this.interaction;
  }

  get options(): CommandInteractionOptionResolver {
    return this.interaction.options as CommandInteractionOptionResolver;
  }

  get musixmatch(): MusixMatch {
    return this.client.music.musixmatch;
  }

  get voice(): VoiceState {
    return this.member?.voice as VoiceState;
  }

  get database(): SukiClient['database'] {
    return this.client.database;
  }

  async reply(options: InteractionReplyOptions) {
    await this.interaction.reply(options);
  }

  async deferReply(options: InteractionDeferReplyOptions) {
    await this.interaction.deferReply(options);
  }
}

interface CommandContextOptions {
  interaction: ChatInputCommandInteraction;
}

export { CommandContext };
