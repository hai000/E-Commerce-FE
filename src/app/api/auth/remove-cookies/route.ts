import { NextResponse } from 'next/server';  // Đảm bảo đã import NextResponse từ next/server
import cookie from 'cookie';
import {redirect} from "next/navigation";

export async function POST(request: Request) {

    const response = NextResponse.json({
        success: true,
    });
        response.headers.append('Set-Cookie', cookie.serialize('accessToken', '', {
            httpOnly: true, // Bảo mật cookie
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Thời gian hết hạn trong quá khứ
            path: '/',
        }));

        response.headers.append('Set-Cookie', cookie.serialize('refreshToken', '', {
            httpOnly: true, // Bảo mật cookie
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Thời gian hết hạn trong quá khứ
            path: '/',
        }));
    return response;
}