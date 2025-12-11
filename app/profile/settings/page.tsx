"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";

const PROVIDER_TYPES = [
    { value: "STUDIO", label: "Studio d'enregistrement" },
    { value: "MIXING", label: "Ingénieur son / Mixage" },
    { value: "MASTERING", label: "Mastering" },
    { value: "BEATMAKER", label: "Beatmaker / Producteur" },
    { value: "VOCAL_COACH", label: "Coaching vocal" },
    { value: "PHOTO_VIDEO", label: "Photographe / Vidéaste" },
    { value: "GRAPHIC", label: "Graphiste / Designer" },
    { value: "OTHER", label: "Autre" },
];

const MUSIC_GENRES = [
    "Rap", "RnB", "Pop", "Rock", "Électro", "Jazz", "Reggae",
    "Afrobeats", "Drill", "Trap", "Lo-fi", "Soul", "Gospel"
];

type Profile = {
    displayName: string | null;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    skills: string[];
};

export default function ProfileSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { user, isAuthenticated, _hasHydrated, updateUser } = useUserStore();
    const router = useRouter();

    // Form state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [providerType, setProviderType] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        async function loadProfile() {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Session expirée");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    const profile: Profile = data.profile;
                    setDisplayName(profile.displayName || "");
                    setBio(profile.bio || "");
                    setLocation(profile.location || "");
                    setAvatarUrl(profile.avatarUrl);
                    setCoverUrl(profile.coverUrl);

                    // Parse skills
                    const skills = profile.skills || [];
                    const providerTypeValue = skills.find(s =>
                        PROVIDER_TYPES.some(pt => pt.value === s)
                    );
                    if (providerTypeValue) {
                        setProviderType(providerTypeValue);
                    }
                    setSelectedGenres(skills.filter(s =>
                        MUSIC_GENRES.includes(s)
                    ));
                }
            } catch {
                setError("Erreur de chargement");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [_hasHydrated, isAuthenticated, router]);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : prev.length < 5 ? [...prev, genre] : prev
        );
    };

    async function handleSave() {
        setSaving(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Session expirée");
            setSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    displayName,
                    bio,
                    location,
                    avatarUrl,
                    coverUrl,
                    skills: user?.role === "PROVIDER"
                        ? [providerType, ...selectedGenres].filter(Boolean)
                        : selectedGenres,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Erreur lors de la sauvegarde");
                return;
            }

            updateUser({ name: displayName });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Erreur de connexion");
        } finally {
            setSaving(false);
        }
    }

    const isProvider = user?.role === "PROVIDER";

    if (!_hasHydrated || loading) {
        return (
            <div className="container max-w-2xl py-10">
                <div className="space-y-4">
                    <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
                    <div className="h-32 w-full bg-muted/30 rounded-xl animate-pulse" />
                    <div className="h-64 w-full bg-muted/30 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="container relative z-10 max-w-2xl py-10 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Paramètres du profil</h1>
                        <p className="text-muted-foreground">Personnalisez votre profil public</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                        Profil mis à jour avec succès !
                    </div>
                )}

                {/* Cover Image */}
                <Card className="bg-card/30 backdrop-blur-lg border-white/10 overflow-hidden">
                    <div className="p-6 space-y-4">
                        <Label>Photo de couverture</Label>
                        <ImageUpload
                            value={coverUrl}
                            onChange={setCoverUrl}
                            aspectRatio={4}
                            minWidth={800}
                            maxWidth={1920}
                            variant="cover"
                            label="Changer la couverture"
                        />
                    </div>
                </Card>

                {/* Avatar & Basic Info */}
                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6 space-y-6">
                    <div className="flex items-start gap-6">
                        <div className="text-center space-y-2">
                            <Label>Photo</Label>
                            {avatarUrl ? (
                                <ImageUpload
                                    value={avatarUrl}
                                    onChange={setAvatarUrl}
                                    aspectRatio={1}
                                    minWidth={150}
                                    maxWidth={500}
                                    variant="avatar"
                                />
                            ) : (
                                <div
                                    className="cursor-pointer"
                                    onClick={() => document.getElementById('settings-avatar-upload')?.click()}
                                >
                                    <UserAvatar
                                        name={displayName || user?.name}
                                        size="xl"
                                        className="ring-4 ring-white/10 hover:ring-primary/50 transition-all"
                                    />
                                    <input
                                        id="settings-avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => setAvatarUrl(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Nom affiché</Label>
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Votre nom d'artiste ou de studio"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Localisation</Label>
                                <CityAutocomplete
                                    value={location}
                                    onChange={setLocation}
                                    placeholder="Votre ville..."
                                />
                            </div>
                        </div>
                    </div>

                    {isProvider && (
                        <div className="space-y-2">
                            <Label>Type de prestataire</Label>
                            <Select value={providerType} onValueChange={setProviderType}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Choisissez votre spécialité" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROVIDER_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={isProvider
                                ? "Décrivez votre studio, votre expérience, vos équipements..."
                                : "Parlez-nous de vous, de votre musique..."
                            }
                            rows={4}
                            className="bg-white/5 border-white/10 resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>
                            {isProvider ? "Genres musicaux" : "Genres préférés"}
                            <span className="text-muted-foreground text-xs ml-2">(max 5)</span>
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {MUSIC_GENRES.map((genre) => (
                                <Badge
                                    key={genre}
                                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${selectedGenres.includes(genre)
                                            ? "bg-primary hover:bg-primary/80"
                                            : "hover:bg-white/10"
                                        }`}
                                    onClick={() => toggleGenre(genre)}
                                >
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Annuler</Link>
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
}
