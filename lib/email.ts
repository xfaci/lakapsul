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
    emailVerification: (data: { name: string; verificationUrl: string }) => ({
        subject: 'Vérifiez votre adresse email - La Kapsul',
        html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérification email - La Kapsul</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; width: 100%; background: linear-gradient(135deg, #1a1a1a 0%, #2d1b40 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(138, 43, 226, 0.3);">
                                <!-- Header avec logo -->
                                <tr>
                                    <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(138, 43, 226, 0.2);">
                                        <div style="font-size: 32px; font-weight: 700; color: #b794f6; margin-bottom: 8px;">
                                            🎵 La Kapsul
                                        </div>
                                        <p style="margin: 0; color: #a0a0a0; font-size: 14px;">Plateforme des Créateurs Musicaux</p>
                                    </td>
                                </tr>
                                <!-- Contenu principal -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #ffffff;">
                                            Bonjour ${data.name} 👋
                                        </h1>
                                        <p style="margin: 0 0 24px; line-height: 1.6; color: #d0d0d0; font-size: 16px;">
                                            Bienvenue sur <strong style="color: #b794f6;">La Kapsul</strong> ! Nous sommes ravis de t'accueillir dans notre communauté de créateurs musicaux.
                                        </p>
                                        <p style="margin: 0 0 32px; line-height: 1.6; color: #d0d0d0; font-size: 16px;">
                                            Pour finaliser ton inscription et accéder à toutes les fonctionnalités de la plateforme, merci de vérifier ton adresse email en cliquant sur le bouton ci-dessous :
                                        </p>
                                        <!-- Bouton CTA -->
                                        <table role="presentation" style="margin: 0 auto 32px;">
                                            <tr>
                                                <td style="border-radius: 8px; background: linear-gradient(135deg, #b794f6 0%, #8a2be2 50%, #6a0dad 100%); box-shadow: 0 4px 16px rgba(138, 43, 226, 0.4);">
                                                    <a href="${data.verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                                        ✓ Vérifier mon email
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- Lien alternatif -->
                                        <div style="padding: 20px; background: rgba(138, 43, 226, 0.1); border-radius: 8px; border-left: 3px solid #8a2be2; margin-bottom: 24px;">
                                            <p style="margin: 0 0 12px; font-size: 14px; color: #a0a0a0;">
                                                <strong style="color: #ffffff;">Le bouton ne fonctionne pas ?</strong>
                                            </p>
                                            <p style="margin: 0; font-size: 13px; color: #a0a0a0; word-break: break-all;">
                                                Copie et colle ce lien dans ton navigateur :<br>
                                                <a href="${data.verificationUrl}" style="color: #b794f6; text-decoration: none;">${data.verificationUrl}</a>
                                            </p>
                                        </div>
                                        <!-- Info sécurité -->
                                        <div style="padding: 16px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 3px solid #ffc107;">
                                            <p style="margin: 0; font-size: 13px; color: #ffc107; line-height: 1.5;">
                                                ⚠️ <strong>Important :</strong> Ce lien est valable pendant 24 heures. Si tu n'as pas demandé cette vérification, tu peux ignorer cet email en toute sécurité.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 32px 40px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(138, 43, 226, 0.2);">
                                        <p style="margin: 0 0 16px; font-size: 14px; color: #a0a0a0; line-height: 1.6;">
                                            Une fois ton email vérifié, tu pourras :
                                        </p>
                                        <ul style="margin: 0; padding-left: 20px; color: #d0d0d0; font-size: 14px; line-height: 1.8;">
                                            <li>Trouver les meilleurs studios et ingénieurs du son</li>
                                            <li>Réserver des services en quelques clics</li>
                                            <li>Gérer tes projets musicaux</li>
                                        </ul>
                                        <hr style="margin: 24px 0; border: none; border-top: 1px solid rgba(138, 43, 226, 0.2);">
                                        <p style="margin: 0; font-size: 12px; color: #808080; text-align: center;">
                                            © 2025 La Kapsul. Tous droits réservés.<br>
                                            <a href="https://lakapsul.vercel.app" style="color: #b794f6; text-decoration: none;">lakapsul.vercel.app</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <!-- Note anti-spam -->
                            <p style="margin: 24px 0 0; font-size: 11px; color: #666; text-align: center; max-width: 600px;">
                                Cet email a été envoyé depuis un domaine vérifié de La Kapsul.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    }),

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
