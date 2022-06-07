import { LanguageManager } from '../Managers';
import { Suki } from '../Suki';

class Language {
  client: Suki;
  languageManager: LanguageManager;

  constructor(client: Suki) {
    this.client = client;
    this.client.languages = this;

    this.languageManager = new LanguageManager(client);
    this.languageManager.loadLocales();
  }
}

export { Language };
