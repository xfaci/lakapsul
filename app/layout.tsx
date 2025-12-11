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
  title: "La Kapsul - Le SaaS des Créateurs Musicaux",
  description: "Trouvez les meilleurs studios, ingés son et beatmakers pour vos projets.",
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
