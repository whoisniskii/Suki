import SukiClient from '../SukiClient';
import i18next from 'i18next';
import i18nbackend from 'i18next-fs-backend';
import { readdirSync } from 'fs';

class LocaleManager {
  client: SukiClient;

  constructor(client: SukiClient) {
    this.client = client;
  }

  async execute() {

    this.loadLocales();
  }

  async loadLocales() {
    try {
      await i18next.use(i18nbackend).init({
        ns: ['commands', 'events'],
        defaultNS: 'commands',
        preload: readdirSync('src/Locales'),
        fallbackLng: 'pt-BR',
        backend: { loadPath: 'src/Locales/{{lng}}/{{ns}}.json' },
        load: 'all',
        interpolation: {
          escapeValue: false,
          useRawValueToEscape: true
        },
        returnEmptyString: false,
        returnObjects: true
      });

      console.log('\x1b[32m[LOCALES]\x1b[0m', `Loaded ${i18next.languages.length} locales`);
    } catch (error) {
      return console.log(
        '\x1b[31m[LOCALES]\x1b[0m',
        `Error loading locales.\n${error}`
      );
    }
  }
}

export { LocaleManager };