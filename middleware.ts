import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect /profile to /profile/settings
    if (pathname === '/profile') {
        return NextResponse.redirect(new URL('/profile/settings', request.url));
    }

    // Redirect /settings to /profile/settings
    if (pathname === '/settings') {
        return NextResponse.redirect(new URL('/profile/settings', request.url));
    }

    // Redirect /support to /contact
    if (pathname === '/support') {
        return NextResponse.redirect(new URL('/contact', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile', '/settings', '/support'],
};

