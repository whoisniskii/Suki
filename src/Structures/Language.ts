import { LanguageManager } from '../Managers';
import { SukiClient } from '../SukiClient';

class Language {
  client: SukiClient;
  languageManager: LanguageManager;

  constructor(client: SukiClient) {
    this.client = client;
    this.client.languages = this;

    this.languageManager = new LanguageManager(client);
    this.languageManager.loadLocales();
  }
}

export { Language };
