"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            return;
        }

        // Verify token
        async function verifyToken() {
            try {
                const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
                setTokenValid(res.ok);
            } catch {
                setTokenValid(false);
            }
        }
        verifyToken();
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Une erreur est survenue");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    }

    if (tokenValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (tokenValid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Lien invalide ou expiré</h1>
                    <p className="text-muted-foreground mb-6">
                        Ce lien de réinitialisation n&apos;est plus valide. Les liens expirent après 1 heure.
                    </p>
                    <Button asChild>
                        <Link href="/forgot-password">Demander un nouveau lien</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Mot de passe modifié !</h1>
                    <p className="text-muted-foreground mb-6">
                        Tu vas être redirigé vers la page de connexion...
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/login">Se connecter maintenant</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/30 backdrop-blur-lg border-white/10 p-8">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
                    <p className="text-muted-foreground mt-2">
                        Choisis un mot de passe sécurisé (8 caractères minimum).
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
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
                            <Lock className="h-4 w-4 mr-2" />
                        )}
                        Réinitialiser le mot de passe
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
