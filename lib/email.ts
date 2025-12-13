import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lakapsul.vercel.app';

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'La Kapsul <onboarding@resend.dev>',
            to,
            subject,
            html: html.replace(/{{APP_URL}}/g, appUrl),
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}

// Templates d'emails prêts à l'emploi
export const emailTemplates = {
    welcome: (name: string) => ({
        subject: 'Bienvenue sur La Kapsul ! 🎵',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">Bienvenue ${name} !</h1>
                <p>Ton compte La Kapsul a été créé avec succès.</p>
                <p style="margin-top: 20px;">
                    <a href="{{APP_URL}}/search" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        Découvrir les prestataires
                    </a>
                </p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    L'équipe La Kapsul 🎵
                </p>
            </div>
        `,
    }),

    bookingConfirmed: (data: { service: string; provider: string; date: string }) => ({
        subject: 'Réservation confirmée ✅',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #22C55E;">Ta réservation est confirmée !</h1>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Prestataire:</strong> ${data.provider}</p>
                    <p><strong>Date:</strong> ${data.date}</p>
                </div>
                <p>
                    <a href="{{APP_URL}}/dashboard" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        Voir mes réservations
                    </a>
                </p>
            </div>
        `,
    }),

    newBookingRequest: (data: { artist: string; service: string; date: string }) => ({
        subject: 'Nouvelle demande de réservation 📅',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">Nouvelle réservation !</h1>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>De:</strong> ${data.artist}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Date:</strong> ${data.date}</p>
                </div>
                <p>
                    <a href="{{APP_URL}}/provider/bookings" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        Gérer mes réservations
                    </a>
                </p>
            </div>
        `,
    }),

    passwordReset: (resetUrl: string) => ({
        subject: 'Réinitialisation de mot de passe 🔐',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">Réinitialise ton mot de passe</h1>
                <p>Clique sur le lien ci-dessous (expire dans 1 heure) :</p>
                <p style="margin: 20px 0;">
                    <a href="${resetUrl}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        Réinitialiser mon mot de passe
                    </a>
                </p>
                <p style="color: #666; font-size: 12px;">
                    Si tu n'as pas demandé cette réinitialisation, ignore cet email.
                </p>
            </div>
        `,
    }),

    newMessage: (data: { senderName: string; preview: string }) => ({
        subject: `💬 Nouveau message de ${data.senderName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">Nouveau message</h1>
                <p><strong>${data.senderName}</strong> t'a envoyé un message :</p>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-style: italic;">"${data.preview}..."</p>
                </div>
                <p>
                    <a href="{{APP_URL}}/messages" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        Voir mes messages
                    </a>
                </p>
            </div>
        `,
    }),
};
