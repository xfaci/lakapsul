import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
        }

        const { success, error } = await sendEmail({
            to: email,
            subject: 'Test La Kapsul x Resend ✅',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #8B5CF6;">🎉 Test email La Kapsul</h1>
                    <p>Si tu vois cet email, <strong>Resend + Nodemailer</strong> fonctionnent parfaitement !</p>
                    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                        <p style="color: white; font-size: 18px; margin: 0;">La Kapsul est prêt à envoyer des emails 🚀</p>
                    </div>
                    <p style="margin-top: 20px;">
                        <a href="{{APP_URL}}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                            Aller sur La Kapsul
                        </a>
                    </p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Ce test a été envoyé depuis lakapsul.vercel.app
                    </p>
                </div>
            `,
        });

        if (!success) {
            console.error('Email error:', error);
            return NextResponse.json({ error: 'Erreur envoi', details: String(error) }, { status: 500 });
        }

        return NextResponse.json({ ok: true, message: `Email envoyé avec succès à ${email}` });
    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
