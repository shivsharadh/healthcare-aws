import { NextResponse } from 'next/server';
import { axiosServer } from '@/lib/axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await axiosServer.post('/register', body);

        return NextResponse.json(response.data, { status: 201 });
    } catch (error: any) {
        if (error.response?.data?.detail) {
            return NextResponse.json({ error: error.response.data.detail }, { status: error.response.status });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
