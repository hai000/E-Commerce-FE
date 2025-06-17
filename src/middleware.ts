import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import {auth} from "@/auth";
import {NextAuthRequest} from "next-auth";
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
const allowedRoles = ['user', 'admin', 'employee']
const intlMiddleware = createMiddleware(routing)
export default auth((req) => {
    const publicPathnameRegex = RegExp(
        `^(/(${routing.locales.join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    )
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)
    const pathname = req.nextUrl.pathname
    const userRole = (req.auth?.user?.role||'user').toLowerCase()
    // Nếu là user và truy cập /dashboard => chặn
    if (userRole == 'user' && pathname.startsWith('/dashboard')) {
        const newUrl = new URL('/unauthorized', req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
    // Nếu là employee và truy cập KHÔNG PHẢI /dashboard/employee hoặc /dashboard/overviews => chặn
    if (
        userRole == 'employee' &&
        pathname.startsWith('/dashboard') &&
        pathname !== '/dashboard/products' &&
        pathname !== '/dashboard/product-quantities' &&
        pathname !== '/dashboard/overview'
    ) {
        const newUrl = new URL('/unauthorized', req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
    if (isPublicPage) {
        // return NextResponse.next()
        return intlMiddleware(req)
    } else {
        if (!req.auth) {
            returnLogin(req)
        } else {
            if (!allowedRoles.includes(userRole)) {
                const newUrl = new URL('/unauthorized', req.nextUrl.origin)
                return Response.redirect(newUrl)
            }
            return intlMiddleware(req)
        }
    }
})
function returnLogin(req: NextAuthRequest){
    const newUrl = new URL(
        `/sign-in?callbackUrl=${
            encodeURIComponent(req.nextUrl.pathname) || '/'
        }`,
        req.nextUrl.origin
    )
    return Response.redirect(newUrl)
}
export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)'],
}