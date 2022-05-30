import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class PingData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: 'ping',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:ping'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:ping'),
      },
    };
  }
}
