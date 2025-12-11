import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.redirect(`${origin}/login?error=supabase_config`);
        }

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

            const isNewUser = !dbUser;

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

            // Generate JWT token
            const token = await new SignJWT({ userId: dbUser.id, role: dbUser.role })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('7d')
                .sign(JWT_SECRET);

            // Create auth data for client-side sync
            const authData = {
                token,
                user: {
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.profile?.displayName || dbUser.email,
                    role: dbUser.role,
                },
            };

            // Determine redirect URL
            let redirectUrl: string;
            if (isNewUser) {
                redirectUrl = `${origin}/onboarding`;
            } else if (dbUser.role === 'PROVIDER') {
                redirectUrl = `${origin}/provider/dashboard`;
            } else if (dbUser.role === 'ADMIN') {
                redirectUrl = `${origin}/admin/dashboard`;
            } else {
                redirectUrl = `${origin}/dashboard`;
            }

            // Create response with redirect
            const response = NextResponse.redirect(redirectUrl);

            // Set auth cookie for client-side sync
            response.cookies.set('lakapsul-auth', JSON.stringify(authData), {
                path: '/',
                maxAge: 60, // 1 minute - just enough time for client to read it
                httpOnly: false, // Must be accessible by JavaScript
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return response;
        }
    }

    // If no code or error, redirect to login
    return NextResponse.redirect(`${origin}/login`);
}
