"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 8) {
            setError("Le nouveau mot de passe doit contenir au moins 8 caractères");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Une erreur est survenue");
                return;
            }

            setSuccess(true);
            toast.success("Mot de passe modifié !");
            setTimeout(() => router.push("/settings"), 2000);
        } catch {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="container max-w-md py-20">
                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Mot de passe modifié !</h1>
                    <p className="text-muted-foreground">Redirection en cours...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-md py-20">
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-8">
                <Link href="/settings" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux paramètres
                </Link>

                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Changer le mot de passe</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="8 caractères minimum"
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Changer le mot de passe
                    </Button>
                </form>
            </Card>
        </div>
    );
}
