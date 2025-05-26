export const i18n = {
    locales: [
        { code: 'en', name: 'English', icon: '🇺🇸' },
        { code: 'vi', name: 'Vietnamese', icon: 'vi' },
    ],
    defaultLocale: 'en',
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]