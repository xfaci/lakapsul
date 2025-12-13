"use client";

import { useUserStore } from "@/store/user-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, Loader2, Check } from "lucide-react";
import { useState } from "react";

interface EmailVerificationGateProps {
    children: React.ReactNode;
}

export function EmailVerificationGate({ children }: EmailVerificationGateProps) {
    const { user, _hasHydrated } = useUserStore();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Show loading while hydrating
    if (!_hasHydrated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // If user is verified or has no email (OAuth), allow access
    if (user?.emailVerified) {
        return <>{children}</>;
    }

    async function resendVerification() {
        setSending(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setSent(true);
            } else {
                const data = await res.json();
                setError(data.error || "Erreur lors de l'envoi");
            }
        } catch {
            setError("Erreur de connexion");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="max-w-md w-full p-8 bg-card/50 backdrop-blur border-white/10 text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-yellow-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Vérifie ton email</h2>
                    <p className="text-muted-foreground">
                        Pour accéder à cette fonctionnalité, tu dois d&apos;abord vérifier ton adresse email.
                    </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-left">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200">
                            <p className="font-medium mb-1">Un email t&apos;a été envoyé à :</p>
                            <p className="text-yellow-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        {error}
                    </div>
                )}

                {sent ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                        <Check className="h-5 w-5" />
                        Email envoyé ! Vérifie ta boîte de réception.
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Button
                            onClick={resendVerification}
                            disabled={sending}
                            className="w-full"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Renvoyer l&apos;email
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Pense à vérifier tes spams si tu ne trouves pas l&apos;email.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
