import {
  ChatInputCommandInteraction,
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
  deferred: boolean;

  constructor(client: SukiClient, interaction: ChatInputCommandInteraction) {
    this.client = client;
    this.interaction = interaction;
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
    return this.interaction.guild ?? (this.client.guilds.cache.get(this.interaction.guildId as string) as Guild);
  }

  get channel(): TextChannel | GuildTextBasedChannel {
    return this.interaction.channel as TextChannel;
  }

  get player(): Player | null | undefined {
    return this.client.music.players.get(this.guild.id) as Player;
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
    if (this.deferred) {
      await this.interaction.editReply(options);
    } else {
      await this.interaction.reply(options);
    }
  }

  async defer(options?: InteractionDeferReplyOptions) {
    if (this.interaction instanceof ChatInputCommandInteraction) {
      await this.interaction.deferReply(options);
      this.deferred = true;
    }
  }
}

export { CommandContext };
