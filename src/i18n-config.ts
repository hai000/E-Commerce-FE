export const i18n = {
    locales: [
        { code: 'en', name: 'English', icon: 'us' },
        { code: 'vi', name: 'Tiếng việt', icon: 'vi' },
    ],
    defaultLocale: 'en',
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]