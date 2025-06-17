import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import {NextResponse } from 'next/server';
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
];

const allowedRoles = ['user', 'admin', 'employee'];

const intlMiddleware = createMiddleware(routing);

function isPublicPath(pathname: string): boolean {
    const regex = RegExp(
        `^(/(${routing.locales.join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    );
    return regex.test(pathname);
}

function redirectTo(url: string, req: NextAuthRequest) {
    return NextResponse.redirect(new URL(url, req.nextUrl.origin));
}

export default auth(async (req) => {
    const { pathname } = req.nextUrl;
    const isPublic = isPublicPath(pathname);

    if (isPublic) {
        return intlMiddleware(req);
    }
    console.log(req.auth?.user)
    // Nếu không có đăng nhập thì redirect về sign-in
    if (!req.auth) {
        const cb = encodeURIComponent(req.nextUrl.pathname || '/');
        return redirectTo(`/sign-in?callbackUrl=${cb}`, req);
    }

    // Phân quyền theo role
    const userRole = (req.auth.user?.role || '').toLowerCase();
    // Nếu role không hợp lệ, redirect unauthorized
    if (!allowedRoles.includes(userRole)) {
        return redirectTo('/unauthorized', req);
    }

    // Chặn user truy cập dashboard
    if (
        (userRole == '' || userRole == 'user') &&
        /^\/(?:[a-z]{2}(?:-[A-Z]{2})?)?\/?dashboard/.test(pathname)
    ) {
        return redirectTo('/unauthorized', req);
    }

    // Employee chỉ được vào các trang dashboard/employee, dashboard/overview, dashboard/products, dashboard/product-quantities
    if (userRole === 'employee') {
        const allowEmployee = [
            /^\/(?:[a-z]{2}(?:-[A-Z]{2})?)?\/?dashboard\/?$/,
            /^\/(?:[a-z]{2}(?:-[A-Z]{2})?)?\/?dashboard\/products\/?$/,
            /^\/(?:[a-z]{2}(?:-[A-Z]{2})?)?\/?dashboard\/product-quantities\/?$/,
            /^\/(?:[a-z]{2}(?:-[A-Z]{2})?)?\/?dashboard\/overview\/?$/
        ];
        const matched = allowEmployee.some((r) => r.test(pathname));
        if (!matched) {
            return redirectTo('/unauthorized', req);
        }
    }

    // Nếu vượt qua hết thì cho phép xử lý tiếp middleware quốc tế hóa
    return intlMiddleware(req);
});

export const config = {
    // Bỏ qua api, _next, file tĩnh, v.v...
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};