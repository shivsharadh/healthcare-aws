import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // We can simply decode the JWT since it's verified on the backend.
        const decoded = jose.decodeJwt(token);
        return NextResponse.json({ user: { username: decoded.sub, role: decoded.role } });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
