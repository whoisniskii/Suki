import Command from '../../Structures/Command';
import CommandContext from '../../Structures/CommandContext';
import SukiClient from '../../SukiClient';

export default class PingCommand extends Command {
  constructor(client: SukiClient) {
    super({
      name: '247',
      description: '[ 🎵 Music ] Make the current music player never been destroyed.',
      description_localizations: {
        'pt-BR': '[ 🎵 Música ] Faça o player atual nunca se desconectar.',
      }
    }, client);
  }

  async execute(context: CommandContext): Promise<void> {
    if (!context.member?.permissions.has('manageGuild')) {
      context.send({ content: t('commands.247.noPerm'), flags: 1 << 6 });
      return;
    }

    if(!context.player) {
      context.send(t('commands.247.noPlayer'));
      return;
    }

    const guildDBData = await this.client.guildDB.findOne({ guildID: context.player.guildId });

    if(!guildDBData) {
      await this.client.guildDB.create({
        guildID: context.guild.id,
        lang: 'en-US',
        forever: false
      });
    }

    if(!guildDBData?.forever) {
      await this.client.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: true } });
      context.send(t('commands:247.forever'));
    }


    await this.client.guildDB.updateOne({ guildID: context.player.guildId }, { $set: { forever: false } });
    context.send(t('commands:247.off'));
    if(!context.player.playing) context.player.disconnect();
  }
}