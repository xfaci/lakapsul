"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2, Save, ArrowLeft } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import Link from "next/link";

const DAYS = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 0, label: "Dimanche" },
];

type Slot = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
};

export default function AvailabilityPage() {
    const [slots, setSlots] = useState<Slot[]>(
        DAYS.map((d) => ({
            dayOfWeek: d.value,
            startTime: "09:00",
            endTime: "18:00",
            isActive: d.value >= 1 && d.value <= 5, // Mon-Fri active by default
        }))
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated || user?.role !== "PROVIDER") {
            router.push("/login");
            return;
        }

        loadAvailability();
    }, [_hasHydrated, isAuthenticated, user, router]);

    async function loadAvailability() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/availability", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.availability.length > 0) {
                    // Merge with defaults
                    const merged = DAYS.map((d) => {
                        const existing = data.availability.find((a: Slot) => a.dayOfWeek === d.value);
                        return existing || {
                            dayOfWeek: d.value,
                            startTime: "09:00",
                            endTime: "18:00",
                            isActive: false,
                        };
                    });
                    setSlots(merged);
                }
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/availability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ slots }),
            });

            if (res.ok) {
                toast.success("Disponibilités enregistrées !");
            } else {
                toast.error("Erreur lors de la sauvegarde");
            }
        } catch {
            toast.error("Erreur de connexion");
        } finally {
            setSaving(false);
        }
    }

    function updateSlot(dayOfWeek: number, field: keyof Slot, value: string | boolean) {
        setSlots((prev) =>
            prev.map((s) =>
                s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
            )
        );
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/provider/dashboard">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Disponibilités</h1>
                        <p className="text-muted-foreground">Définissez vos horaires d&apos;ouverture</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Enregistrer
                </Button>
            </div>

            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <div className="space-y-4">
                    {DAYS.map((day) => {
                        const slot = slots.find((s) => s.dayOfWeek === day.value)!;
                        return (
                            <div
                                key={day.value}
                                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${slot.isActive ? "bg-primary/5" : "bg-muted/30"
                                    }`}
                            >
                                <div className="w-32 font-medium">{day.label}</div>

                                <Switch
                                    checked={slot.isActive}
                                    onCheckedChange={(checked) => updateSlot(day.value, "isActive", checked)}
                                />

                                {slot.isActive ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <Input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => updateSlot(day.value, "startTime", e.target.value)}
                                            className="w-32 bg-white/5 border-white/10"
                                        />
                                        <span className="text-muted-foreground">à</span>
                                        <Input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => updateSlot(day.value, "endTime", e.target.value)}
                                            className="w-32 bg-white/5 border-white/10"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">Fermé</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20 p-4">
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-blue-400">À savoir</p>
                        <p className="text-muted-foreground">
                            Ces horaires seront affichés sur votre profil et utilisés pour valider les réservations.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
