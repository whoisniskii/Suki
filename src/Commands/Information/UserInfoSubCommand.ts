import { APIEmbed, EmbedBuilder, GuildMember, PermissionFlagsBits } from 'discord.js';
import { Command, CommandExecuteOptions } from '../../Structures';
import { Suki } from '../../Suki';

export default class UserInfoSubCommand extends Command {
  constructor(client: Suki) {
    super(client);

    this.rawName = 'UserInfoSubCommand';
    this.permissions = {
      bot: [PermissionFlagsBits.EmbedLinks],
      user: [],
    };
    this.config = {
      registerSlashCommands: false,
      devOnly: false,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    const user = await (context.options.getUser('user') ?? context.user).fetch();
    if (!user) {
      context.sendMessage({ content: t('command:user/info/error/noUser'), ephemeral: true });
      return;
    }

    if (user.bot) {
      context.sendMessage({ embeds: [await this.createMemberEmbed({ context, t }), await this.createApplicationEmbed({ context, t })] });
    } else context.sendMessage({ embeds: [await this.createMemberEmbed({ context, t })] });
  }

  async createMemberEmbed({ context, t }: CommandExecuteOptions): Promise<APIEmbed> {
    const user = await (context.options.getUser('user') ?? context.user).fetch();

    const tempMember = context.options.getMember('user') as GuildMember;
    const member = user.id === tempMember?.id ? tempMember : undefined;

    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setAuthor({ name: t('command:user/info/createMemberEmbed/author') })
      .setDescription(`[**${member?.nickname ?? user.username}**](https://discord.com/users/${user.id})`)
      .addFields([
        {
          name: t('command:user/info/createMemberEmbed/fields/name/userId'),
          value: `\`${user.id}\``,
          inline: true,
        },
        {
          name: t('command:user/info/createMemberEmbed/fields/name/userTag'),
          value: `\`${user.tag}\``,
          inline: true,
        },
        {
          name: t('command:user/info/createMemberEmbed/fields/name/accountCreated'),
          value: `<t:${Math.round(user.createdTimestamp / 1000)}:F> (<t:${Math.round(user.createdTimestamp / 1000)}:R>)`,
          inline: true,
        },
      ])
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    if (member && member.joinedTimestamp) {
      embed.addFields([
        {
          name: t('command:user/info/createMemberEmbed/fields/name/joinedAt'),
          value: `<t:${Math.round(member.joinedTimestamp / 1000)}:F> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`,
          inline: false,
        },
      ]);
    }

    embed.setThumbnail(user.displayAvatarURL({ size: 1024 }));

    return embed.data;
  }

  async createApplicationEmbed({ context, t }: CommandExecuteOptions): Promise<APIEmbed> {
    const applicationData = await this.getApplicationInfo(context.options.getUser('user')?.id);

    const applicationEmbed = new EmbedBuilder()
      .setColor('Purple')
      .setAuthor({ name: t('command:user/info/createApplicationEmbed/author') })
      .setTitle(applicationData.name)
      .addFields([
        {
          name: t('command:user/info/createApplicationEmbed/fields/name/guildId'),
          value: applicationData.guild_id ? `\`${applicationData.guild_id}\`` : `\`${t('command:user/info/createApplicationEmbed/fields/error/guildId')}\``,
          inline: true,
        },
        {
          name: t('command:user/info/createApplicationEmbed/fields/name/marks'),
          value: applicationData.tags ? applicationData.tags.join(', ') : t('command:user/info/createApplicationEmbed/fields/error/marks'),
          inline: true,
        },
        {
          name: t('command:user/info/createApplicationEmbed/fields/name/slug'),
          value: applicationData.slug ? `\`${applicationData.slug}\`` : `\`${t('user/info/createApplicationEmbed/fields/error/slug')}\``,
          inline: true,
        },
        {
          name: t('command:user/info/createApplicationEmbed/fields/name/httpKey'),
          value: `\`${applicationData.verify_key}\``,
          inline: true,
        },
      ])
      .setFooter({ text: context.user.tag, iconURL: context.user.displayAvatarURL({ extension: 'png', size: 512 }) })
      .setTimestamp();

    if (applicationData.description) applicationEmbed.setDescription(`${applicationData.description.replace(/\n/g, '\n')}`);

    if (applicationData.icon) applicationEmbed.setThumbnail(`https://cdn.discordapp.com/app-icons/${applicationData.id}/${applicationData.icon}`);

    return applicationEmbed.data;
  }

  async getApplicationInfo(applicationId: string | undefined) {
    const res = await this.client.request(`https://discord.com/api/v10/applications/${applicationId}/rpc`, { method: 'GET' }).then(data => data.body.json());

    return res;
  }
}
