export const currencyConfig = {
    currencies: [
        { code: 'USD', name: 'USD', icon: 'us' },
        { code: 'VND', name: 'VND', icon: 'vn' },
    ],
    defaultCurrency: 'USD',
}
export type Currency = typeof currencyConfig.currencies[number]