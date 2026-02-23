import { NextResponse } from 'next/server';
import { axiosServer } from '@/lib/axios';
import { serialize } from 'cookie';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Send request to FastAPI backend
        const response = await axiosServer.post('/login', body);

        if (response.data.access_token) {
            const cookie = serialize('access_token', response.data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            const res = NextResponse.json({ success: true });
            res.headers.set('Set-Cookie', cookie);
            return res;
        }

        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    } catch (error: any) {
        if (error.response?.data?.detail) {
            return NextResponse.json({ error: error.response.data.detail }, { status: error.response.status });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
