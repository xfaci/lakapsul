"use client";

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface RecaptchaProviderProps {
    children: React.ReactNode;
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // If no reCAPTCHA key is configured, render children without the provider
    if (!recaptchaKey) {
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
