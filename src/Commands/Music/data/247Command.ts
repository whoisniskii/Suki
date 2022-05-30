import { CommandDataStructure } from '../../../Structures';
import { SukiClient } from '../../../SukiClient';

export default class TwentyFourHoursData extends CommandDataStructure {
  constructor(client: SukiClient) {
    super(client);
    this.data = {
      name: '247',
      description: client.languages.languageManager.get('en-US', 'commandDescriptions:247'),
      descriptionLocalizations: {
        'pt-BR': client.languages.languageManager.get('pt-BR', 'commandDescriptions:247'),
      },
    };
  }
}
