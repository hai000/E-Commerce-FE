export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NxtAmzn'
export const APP_SLOGAN =
    process.env.NEXT_PUBLIC_APP_SLOGAN || 'Spend less, enjoy more.'
export const HOST_API = process.env.NEXT_PUBLIC_HOSTAPI || 'http://localhost:8080'
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    'An Amazon clone built with Next.js and MongoDB'
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const FREE_SHIPPING_MIN_PRICE = Number(
    process.env.FREE_SHIPPING_MIN_PRICE || 35
)
export const GET_METHOD = 'GET'
export const POST_METHOD = 'POST'
export const PUT_METHOD = 'PUT'
export const DELETE_METHOD = 'DELETE'