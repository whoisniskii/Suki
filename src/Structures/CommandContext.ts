/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { AdvancedMessageContent, Attachment, CommandInteraction, FileContent, Guild, InteractionDataOptionWithValue, Member, Message, TextableChannel, User } from 'eris';
import { Player } from 'vulkava';
import { MusixMatch } from '../APIS';
import { SukiClient } from '../SukiClient';

type Content = AdvancedMessageContent & {
  fetchReply?: boolean;
  files?: FileContent[];
};

class CommandContext {
  private readonly client: SukiClient;
  private readonly interaction: CommandInteraction;
  private deffered: boolean;

  public options: string[] = [];
  public attachments: Attachment[];

  constructor(client: SukiClient, interaction: CommandInteraction, options: string[] = []) {
    this.client = client;
    this.interaction = interaction;
    this.attachments = [];

    this.options = options;

    if (interaction.data.type === 1) {
      if (interaction.data.options?.[0].type === 1) {
        this.options.push(interaction.data.options[0].name.toString().trim());

        if (interaction.data.options[0].options) {
          for (const values of interaction.data.options[0].options) {
            this.options.push(values.value.toString().trim());
          }
        }
      } else {
        const opts = interaction.data.options as InteractionDataOptionWithValue[];

        this.options = opts?.map(ops => ops.value.toString().trim()) ?? [];
      }
    } else if (interaction.data.type === 2) {
      this.options.push(interaction.data.target_id!);
    } else if (interaction.data.type === 3) {
      this.options = interaction.data.resolved!.messages!.get(interaction.data.target_id!)!.content.split(/ + /);
    }
  }

  get user(): User {
    return this.interaction.member!.user;
  }

  get member(): Member | null | undefined {
    return this.interaction.member;
  }

  get guild(): Guild {
    return this.client.guilds.get(this.interaction.guildID!)!;
  }

  get channel(): TextableChannel {
    return this.interaction.channel;
  }

  get player(): Player {
    return (this.client.music.players.get(this.guild.id) as Player) || null;
  }

  get application(): CommandInteraction {
    return this.interaction;
  }

  get musixmatch(): MusixMatch {
    return this.client.music.musixmatch;
  }

  async send(content: Content | string): Promise<Message<TextableChannel> | void> {
    content = this.formatContent(content);

    const fetchReply = !!content.fetchReply;
    const { files } = content;

    delete content.fetchReply;
    delete content.files;

    if (content.content === undefined) content.content = '';

    if (this.deffered) {
      await this.interaction.editOriginalMessage(content, files);
    } else {
      await this.interaction.createMessage(content, files);
    }

    if (fetchReply) {
      return this.interaction.getOriginalMessage();
    }
  }

  private formatContent(content: Content | string): Content {
    if (typeof content === 'string') return { content };
    return content;
  }

  async defer() {
    if (this.interaction instanceof CommandInteraction) {
      await this.interaction.defer();
      this.deffered = true;
    }
  }
}

export { CommandContext };
// By https://github.com/davidffa/D4rkBot, thanks D4rk.
