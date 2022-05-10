import { Command, CommandExecuteOptions } from '../../Structures';
import { SukiClient } from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super(
      {
        name: '247',
        description: '[ 🎵 Music ] Make the current music player never been destroyed.',
        descriptionLocalizations: {
          'pt-BR': '[ 🎵 Música ] Faça o player atual nunca se desconectar.',
        },
      },
      client,
    );

    this.config = {
      autoDefer: true,
      ephemeral: false,
      guildOnly: true,
    };
  }

  async execute({ context, t }: CommandExecuteOptions) {
    if (!context.player) {
      context.reply(t('commands.247.noPlayer'));
      return;
    }

    const guildDBData = await this.client.database.getGuild(context.player.guildId);

    if (!guildDBData?.forever) {
      await this.client.database.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: true } });
      context.reply(t('commands:247.forever'));
    }

    await this.client.database.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: false } });
    context.reply(t('commands:247.off'));
    if (!context.player.playing) context.player.disconnect();
  }
}
