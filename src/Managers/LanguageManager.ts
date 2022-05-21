import { readdirSync } from 'fs';
import i18next from 'i18next';
import i18nbackend from 'i18next-fs-backend';

class LanguageManager {
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

      return console.log('\x1b[32m[LOCALES]\x1b[0m', `Loaded ${i18next.languages.length} locales`);
    } catch (error) {
      return console.log('\x1b[31m[LOCALES]\x1b[0m', `Error loading locales.\n${error}`);
    }
  }

  get(lang: SupportedLocales, path: AllLocalePaths) {
    const data = i18next.getFixedT(lang, path);
    return data(path);
  }
}

export type LocaleCategories = 'command' | 'commandNames' | 'commandDescriptions';
export type SupportedLocales = 'en-US' | 'pt-BR';

export type CommandLocaleKeys = keyof typeof import('../Locales/pt-BR/command.json');
export type CommandDescriptionsKeys = keyof typeof import('../Locales/pt-BR/commandDescriptions.json');
export type CommandNamesKeys = keyof typeof import('../Locales/pt-BR/commandNames.json');
export type PermissionLocaleKeys = keyof typeof import('../Locales/pt-BR/permissions.json');

export type AllLocaleKeys = CommandLocaleKeys | CommandNamesKeys | CommandDescriptionsKeys | PermissionLocaleKeys;

export type AllLocalePaths = `command:${CommandLocaleKeys}` | `commandDescriptions:${CommandDescriptionsKeys}` | `commandNames:${CommandNamesKeys}` | `permissions:${PermissionLocaleKeys}`;

export { LanguageManager };
