import axios from 'axios';

// This instance is used by Next.js Route Handlers (Server) to talk directly to FastAPI.
// We use the environment variable which points to the ALB.
export const axiosServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// This instance is used by Client Components to talk to our Next.js API routes.
// Requests go to /api/..., which then proxy to FastAPI.
export const axiosClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
