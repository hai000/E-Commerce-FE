import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(request: Request) {
    const { accessToken, refreshToken } = await request.json();

    const response = NextResponse.json({ message: 'Cookies set' });

    response.headers.append('Set-Cookie', cookie.serialize('accessToken', accessToken, {
        httpOnly: true, // Bảo mật cookie
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
    }));

    response.headers.append('Set-Cookie', cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true, // Bảo mật cookie
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    }));

    return response;
}