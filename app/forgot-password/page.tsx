"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Une erreur est survenue");
                return;
            }

            setSent(true);
        } catch {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Email envoyé !</h1>
                    <p className="text-muted-foreground mb-6">
                        Si un compte existe avec l&apos;adresse <strong>{email}</strong>, tu recevras un lien pour réinitialiser ton mot de passe.
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Vérifie aussi tes spams si tu ne vois pas l&apos;email.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/login">Retour à la connexion</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8">
                <Link href="/login" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Link>

                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
                    <p className="text-muted-foreground mt-2">
                        Entre ton email et nous t&apos;enverrons un lien de réinitialisation.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ton@email.com"
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Mail className="h-4 w-4 mr-2" />
                        )}
                        Envoyer le lien
                    </Button>
                </form>
            </Card>
        </div>
    );
}
