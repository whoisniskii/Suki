import { Locale } from 'discord.js';
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
        preload: readdirSync('./Locales'),
        fallbackLng: 'pt-BR',
        backend: { loadPath: './Locales/{{lng}}/{{ns}}.json' },
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

  recommendedLocale(locale: Locale) {
    let recommendedLocale = 'en-US' as SupportedLocales;

    switch (locale.replace('_', '-')) {
      case Locale.EnglishUS:
      case Locale.EnglishGB:
        recommendedLocale = 'en-US';
        break;
      case Locale.PortugueseBR:
        recommendedLocale = 'pt-BR';
        break;
    }
    return recommendedLocale;
  }
}

export type LocaleCategories = 'command' | 'commandNames' | 'commandDescriptions' | 'events';
export type SupportedLocales = 'en-US' | 'pt-BR';

export type CommandLocaleKeys = keyof typeof import('../Locales/en-US/command.json');
export type CommandDescriptionsKeys = keyof typeof import('../Locales/en-US/commandDescriptions.json');
export type CommandNamesKeys = keyof typeof import('../Locales/en-US/commandNames.json');
export type PermissionLocaleKeys = keyof typeof import('../Locales/en-US/permissions.json');
export type EventLocaleKeys = keyof typeof import('../Locales/en-US/events.json');

export type AllLocaleKeys = CommandLocaleKeys | CommandNamesKeys | CommandDescriptionsKeys | EventLocaleKeys | PermissionLocaleKeys;

export type AllLocalePaths =
  | `command:${CommandLocaleKeys}`
  | `commandDescriptions:${CommandDescriptionsKeys}`
  | `commandNames:${CommandNamesKeys}`
  | `events:${EventLocaleKeys}`
  | `permissions:${PermissionLocaleKeys}`;

export { LanguageManager };
