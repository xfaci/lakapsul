import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthSync } from "@/components/providers/auth-sync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "La Kapsul - Plateforme des Créateurs Musicaux",
    template: "%s | La Kapsul",
  },
  description: "Trouvez les meilleurs studios d'enregistrement, ingénieurs du son, beatmakers et producteurs pour vos projets musicaux. Réservez en ligne facilement.",
  keywords: ["studio enregistrement", "beatmaker", "ingénieur son", "musique", "production musicale", "mixage", "mastering", "artiste", "rap", "rnb"],
  authors: [{ name: "La Kapsul" }],
  creator: "La Kapsul",
  publisher: "La Kapsul",
  metadataBase: new URL("https://lakapsul.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lakapsul.vercel.app",
    siteName: "La Kapsul",
    title: "La Kapsul - Plateforme des Créateurs Musicaux",
    description: "Trouvez les meilleurs studios, ingés son et beatmakers pour vos projets musicaux.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "La Kapsul - Plateforme des Créateurs Musicaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Kapsul - Plateforme des Créateurs Musicaux",
    description: "Trouvez les meilleurs studios, ingés son et beatmakers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "votre-code-google-search-console",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <AuthSync />
        </ThemeProvider>
      </body>
    </html>
  );
}
