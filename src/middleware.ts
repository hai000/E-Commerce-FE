import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import {auth} from "@/auth";

const publicPages = [
    '/',
    '/search',
    '/sign-in',
    '/sign-up',
    '/cart',
    '/cart/(.*)',
    '/product/(.*)',
    '/page/(.*)',
]
const intlMiddleware = createMiddleware(routing)
export default auth((req) => {
    const publicPathnameRegex = RegExp(
        `^(/(${routing.locales.join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    )
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

    if (isPublicPage) {
        // return NextResponse.next()
        return intlMiddleware(req)
    } else {
        if (!req.auth) {
            const newUrl = new URL(
                `/sign-in?callbackUrl=${
                    encodeURIComponent(req.nextUrl.pathname) || '/'
                }`,
                req.nextUrl.origin
            )
            return Response.redirect(newUrl)
        } else {
            return intlMiddleware(req)
        }
    }
})
export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)'],
}