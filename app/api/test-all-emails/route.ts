import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

// Test endpoint to send all email templates
export async function GET() {
    const testEmail = 'noreply.lakapsul@gmail.com'; // Must be Resend account email until domain verified
    const results: { template: string; success: boolean; error?: string }[] = [];

    // 1. Test basic email
    const basicResult = await sendEmail({
        to: testEmail,
        subject: '1️⃣ Test basique La Kapsul',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #8B5CF6;">🎉 Test Email Basique</h1>
                <p>Si tu vois cet email, Resend fonctionne !</p>
                <p><a href="{{APP_URL}}">Aller sur La Kapsul</a></p>
            </div>
        `,
    });
    results.push({ template: 'basic', success: basicResult.success });

    // 2. Welcome email
    const welcome = emailTemplates.welcome('Test User');
    const welcomeResult = await sendEmail({
        to: testEmail,
        subject: '2️⃣ ' + welcome.subject,
        html: welcome.html,
    });
    results.push({ template: 'welcome', success: welcomeResult.success });

    // 3. Booking confirmed
    const booking = emailTemplates.bookingConfirmed({
        service: 'Session Studio',
        provider: 'Sophie Mix',
        date: '15 janvier 2025 à 14h00',
    });
    const bookingResult = await sendEmail({
        to: testEmail,
        subject: '3️⃣ ' + booking.subject,
        html: booking.html,
    });
    results.push({ template: 'bookingConfirmed', success: bookingResult.success });

    // 4. New booking request
    const newBooking = emailTemplates.newBookingRequest({
        artist: 'MC Flow',
        service: 'Mixage',
        date: '20 janvier 2025 à 10h00',
    });
    const newBookingResult = await sendEmail({
        to: testEmail,
        subject: '4️⃣ ' + newBooking.subject,
        html: newBooking.html,
    });
    results.push({ template: 'newBookingRequest', success: newBookingResult.success });

    // 5. New message
    const newMsg = emailTemplates.newMessage({
        senderName: 'DJ Beats',
        preview: 'Salut ! J\'ai vu ton profil et j\'aimerais réserver une session...',
    });
    const newMsgResult = await sendEmail({
        to: testEmail,
        subject: '5️⃣ ' + newMsg.subject,
        html: newMsg.html,
    });
    results.push({ template: 'newMessage', success: newMsgResult.success });

    // 6. Password reset
    const resetPwd = emailTemplates.passwordReset('https://lakapsul.vercel.app/reset-password?token=test123');
    const resetResult = await sendEmail({
        to: testEmail,
        subject: '6️⃣ ' + resetPwd.subject,
        html: resetPwd.html,
    });
    results.push({ template: 'passwordReset', success: resetResult.success });

    const allSuccess = results.every(r => r.success);
    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
        status: allSuccess ? 'all_success' : 'partial',
        message: `${successCount}/6 emails envoyés à ${testEmail}`,
        results,
        note: 'Avec onboarding@resend.dev, les emails ne peuvent être envoyés qu\'à l\'email du compte Resend. Pour envoyer à d\'autres destinataires, vérifie un domaine sur resend.com/domains',
    });
}
