import { readdirSync } from 'fs';
import i18next from 'i18next';
import i18nbackend from 'i18next-fs-backend';
import { SukiClient } from '../SukiClient';

class LanguageManager {
  client: SukiClient;
  constructor(client: SukiClient) {
    this.client = client;
  }

  async loadLocales() {
    try {
      await i18next.use(i18nbackend).init({
        ns: ['commandNames', 'commandDescriptions', 'command', 'events', 'permissions'],
        defaultNS: 'command',
        preload: readdirSync('src/Locales'),
        fallbackLng: 'pt-BR',
        backend: { loadPath: 'src/Locales/{{lng}}/{{ns}}.json' },
        load: 'all',
        interpolation: {
          escapeValue: false,
          useRawValueToEscape: true,
        },
        returnEmptyString: false,
        returnObjects: true,
      });

      return this.client.logger.info(`Loaded ${i18next.languages.length} locales`, 'LOCALES');
    } catch (error) {
      return this.client.logger.error(`Error loading locales.\n${error}`, 'LOCALES');
    }
  }

  get(lang: SupportedLocales, path: AllLocalePaths) {
    const data = i18next.getFixedT(lang, path);
    return data(path);
  }
}

export type LocaleCategories = 'command' | 'commandNames' | 'commandDescriptions' | 'events';
export type SupportedLocales = 'en-US' | 'pt-BR';

export type CommandLocaleKeys = keyof typeof import('../Locales/pt-BR/command.json');
export type CommandDescriptionsKeys = keyof typeof import('../Locales/pt-BR/commandDescriptions.json');
export type CommandNamesKeys = keyof typeof import('../Locales/pt-BR/commandNames.json');
export type PermissionLocaleKeys = keyof typeof import('../Locales/pt-BR/permissions.json');
export type EventLocaleKeys = keyof typeof import('../Locales/pt-BR/events.json');

export type AllLocaleKeys = CommandLocaleKeys | CommandNamesKeys | CommandDescriptionsKeys | EventLocaleKeys | PermissionLocaleKeys;

export type AllLocalePaths =
  | `command:${CommandLocaleKeys}`
  | `commandDescriptions:${CommandDescriptionsKeys}`
  | `commandNames:${CommandNamesKeys}`
  | `events:${EventLocaleKeys}`
  | `permissions:${PermissionLocaleKeys}`;

export { LanguageManager };
