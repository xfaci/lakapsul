import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();

        // Exchange code for session
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('OAuth callback error:', error);
            return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
        }

        if (user) {
            // Check if user exists in our database
            let dbUser = await prisma.user.findUnique({
                where: { email: user.email! },
                include: { profile: true },
            });

            if (!dbUser) {
                // Create user in our database
                const username = user.email!.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);

                dbUser = await prisma.user.create({
                    data: {
                        email: user.email!,
                        password: '', // OAuth users don't have a password
                        role: 'ARTIST', // Default role
                        profile: {
                            create: {
                                username,
                                displayName: user.user_metadata?.full_name || user.user_metadata?.name || username,
                                avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                            },
                        },
                    },
                    include: { profile: true },
                });
            }

            // Redirect based on role
            if (dbUser.role === 'PROVIDER') {
                return NextResponse.redirect(`${origin}/provider/dashboard`);
            } else if (dbUser.role === 'ADMIN') {
                return NextResponse.redirect(`${origin}/admin/dashboard`);
            } else {
                return NextResponse.redirect(`${origin}/dashboard`);
            }
        }
    }

    // If no code or error, redirect to login
    return NextResponse.redirect(`${origin}/login`);
}
