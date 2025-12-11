"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { Loader2, Music, Sparkles, User } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { UserAvatar } from "@/components/ui/user-avatar";

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

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, updateUser } = useUserStore();
    const router = useRouter();

    // Form state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(user?.name || "");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [providerType, setProviderType] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : prev.length < 5 ? [...prev, genre] : prev
        );
    };

    async function handleComplete() {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Session expirée. Veuillez vous reconnecter.");
            setLoading(false);
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
                    displayName: displayName || user?.name,
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
                setError(data.error || "Erreur lors de la sauvegarde.");
                setLoading(false);
                return;
            }

            // Update local user store
            updateUser({ name: displayName || user?.name });

            // Redirect based on role
            if (user?.role === "PROVIDER") {
                router.push("/provider/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Erreur de connexion au serveur.");
            setLoading(false);
        }
    }

    const isProvider = user?.role === "PROVIDER";

    return (
        <div className="relative min-h-screen">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="container relative z-10 flex items-center justify-center min-h-screen py-10">
                <div className="w-full max-w-lg">
                    {/* Progress indicator */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-2 w-16 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 mb-4">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {step === 1 && "Bienvenue sur La Kapsul !"}
                            {step === 2 && "Personnalisez votre profil"}
                            {step === 3 && "Dernière étape"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {step === 1 && "Ajoutez votre photo et couverture"}
                            {step === 2 && "Dites-nous en plus sur vous"}
                            {step === 3 && "Choisissez vos préférences"}
                        </p>
                    </div>

                    <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6 space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Photo */}
                        {step === 1 && (
                            <>
                                <div className="space-y-4">
                                    <Label className="text-center block">Photo de couverture</Label>
                                    <ImageUpload
                                        value={coverUrl}
                                        onChange={setCoverUrl}
                                        aspectRatio={4}
                                        minWidth={800}
                                        maxWidth={1920}
                                        variant="cover"
                                        label="Ajouter une couverture"
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <div className="text-center space-y-2">
                                        <Label>Photo de profil</Label>
                                        <div className="flex justify-center">
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
                                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                                >
                                                    <UserAvatar
                                                        name={displayName || user?.name}
                                                        size="xl"
                                                        className="ring-4 ring-white/10 hover:ring-primary/50 transition-all"
                                                    />
                                                    <input
                                                        id="avatar-upload"
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
                                        <p className="text-xs text-muted-foreground">
                                            Cliquez pour ajouter une photo
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={() => setStep(2)} className="w-full">
                                    Continuer
                                </Button>
                            </>
                        )}

                        {/* Step 2: Info */}
                        {step === 2 && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nom affiché
                                    </Label>
                                    <Input
                                        id="displayName"
                                        placeholder="Comment voulez-vous être appelé ?"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
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
                                    <Label htmlFor="bio" className="flex items-center gap-2">
                                        <Music className="h-4 w-4" />
                                        Bio
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder={isProvider
                                            ? "Décrivez votre studio, votre expérience, vos équipements..."
                                            : "Parlez-nous de vous, de votre musique..."
                                        }
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        className="bg-white/5 border-white/10 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                        Retour
                                    </Button>
                                    <Button onClick={() => setStep(3)} className="flex-1">
                                        Continuer
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Genres */}
                        {step === 3 && (
                            <>
                                <div className="space-y-3">
                                    <Label>
                                        {isProvider
                                            ? "Genres musicaux que vous maîtrisez"
                                            : "Vos genres préférés"
                                        }
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

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={loading}>
                                        Retour
                                    </Button>
                                    <Button onClick={handleComplete} className="flex-1" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Terminer
                                    </Button>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => router.push(user?.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard")}
                            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            disabled={loading}
                        >
                            Passer cette étape
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
