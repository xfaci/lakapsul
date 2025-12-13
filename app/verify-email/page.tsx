"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("Token manquant");
            return;
        }

        async function verifyEmail() {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setError(data.error || "Erreur de vérification");
                    return;
                }

                setStatus("success");
                setTimeout(() => router.push("/login"), 3000);
            } catch {
                setStatus("error");
                setError("Erreur de connexion");
            }
        }

        verifyEmail();
    }, [token, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <h1 className="text-xl font-bold">Vérification en cours...</h1>
                </Card>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Erreur de vérification</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button asChild>
                        <Link href="/login">Retour à la connexion</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Email vérifié !</h1>
                <p className="text-muted-foreground mb-6">
                    Ton compte est maintenant activé. Tu vas être redirigé...
                </p>
                <Button asChild variant="outline">
                    <Link href="/login">Se connecter</Link>
                </Button>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
