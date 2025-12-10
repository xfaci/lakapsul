"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Profile = {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    location: string | null;
    skills: string[];
    avatarUrl: string | null;
    coverUrl: string | null;
};

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [skillsInput, setSkillsInput] = useState("");

    useEffect(() => {
        async function load() {
            setError(null);
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Veuillez vous connecter.");
                setLoading(false);
                return;
            }
            try {
                const res = await fetch("/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Impossible de charger le profil.");
                } else {
                    setProfile(data.profile);
                    setSkillsInput(data.profile?.skills?.join(", ") || "");
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function save() {
        setSaving(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Veuillez vous connecter.");
            setSaving(false);
            return;
        }

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                displayName: profile?.displayName,
                bio: profile?.bio,
                location: profile?.location,
                avatarUrl: profile?.avatarUrl,
                coverUrl: profile?.coverUrl,
                skills: skillsInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Échec de la sauvegarde.");
        } else {
            setProfile(data.profile);
        }
        setSaving(false);
    }

    if (loading) {
        return <div className="container py-10 text-muted-foreground">Chargement...</div>;
    }

    return (
        <div className="container py-10 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Mon profil</h1>
                <p className="text-muted-foreground text-sm">Personnalisez votre profil public.</p>
            </div>

            <Card className="p-6 space-y-4">
                {error && <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-md p-2">{error}</div>}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Nom affiché</Label>
                        <Input
                            value={profile?.displayName ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, displayName: e.target.value } : p))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Localisation</Label>
                        <Input
                            value={profile?.location ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, location: e.target.value } : p))}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Bio</Label>
                        <Textarea
                            value={profile?.bio ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, bio: e.target.value } : p))}
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Avatar URL</Label>
                        <Input
                            value={profile?.avatarUrl ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, avatarUrl: e.target.value } : p))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Cover URL</Label>
                        <Input
                            value={profile?.coverUrl ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, coverUrl: e.target.value } : p))}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Compétences (séparées par des virgules)</Label>
                        <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
                        <div className="flex flex-wrap gap-2 pt-1">
                            {skillsInput
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                        </div>
                    </div>
                </div>
                <Button onClick={save} disabled={saving}>
                    Sauvegarder
                </Button>
            </Card>
        </div>
    );
}
