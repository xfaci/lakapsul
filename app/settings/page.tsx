"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Lock, Bell, Loader2, Save, ArrowLeft } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [notifications, setNotifications] = useState({
        email: true,
        bookings: true,
        messages: true,
        marketing: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // Load user data
        setEmail(user?.email || "");
        setDisplayName(user?.name || "");
        setLoading(false);
    }, [_hasHydrated, isAuthenticated, user, router]);

    async function handleSave() {
        setSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ displayName }),
            });

            if (res.ok) {
                toast.success("Paramètres enregistrés !");
            } else {
                toast.error("Erreur lors de la sauvegarde");
            }
        } catch {
            toast.error("Erreur de connexion");
        } finally {
            setSaving(false);
        }
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-10 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Paramètres</h1>
                    <p className="text-muted-foreground">Gère ton compte et tes préférences</p>
                </div>
            </div>

            {/* Profile Settings */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Profil</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="displayName">Nom affiché</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={email}
                            disabled
                            className="bg-white/5 border-white/10 opacity-60"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            L&apos;email ne peut pas être modifié
                        </p>
                    </div>
                </div>
            </Card>

            {/* Password */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-primary" />
                        <div>
                            <h2 className="font-semibold">Mot de passe</h2>
                            <p className="text-sm text-muted-foreground">
                                Change ton mot de passe
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/settings/password">Modifier</Link>
                    </Button>
                </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Notifications email</p>
                            <p className="text-sm text-muted-foreground">
                                Recevoir les notifications par email
                            </p>
                        </div>
                        <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, email: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Réservations</p>
                            <p className="text-sm text-muted-foreground">
                                Nouvelles réservations et confirmations
                            </p>
                        </div>
                        <Switch
                            checked={notifications.bookings}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, bookings: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-sm text-muted-foreground">
                                Nouveaux messages reçus
                            </p>
                        </div>
                        <Switch
                            checked={notifications.messages}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, messages: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Marketing</p>
                            <p className="text-sm text-muted-foreground">
                                Actualités et offres promotionnelles
                            </p>
                        </div>
                        <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, marketing: checked })
                            }
                        />
                    </div>
                </div>
            </Card>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer les modifications
            </Button>
        </div>
    );
}
