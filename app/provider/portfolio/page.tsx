"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Music, Video, ImageIcon, Plus, Trash2, Loader2, ArrowLeft, ExternalLink, Save
} from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import Link from "next/link";

type Media = {
    id: string;
    type: "IMAGE" | "AUDIO" | "VIDEO";
    url: string;
    title: string | null;
    description: string | null;
};

type MediaType = "IMAGE" | "AUDIO" | "VIDEO";

export default function PortfolioPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newType, setNewType] = useState<MediaType>("AUDIO");
    const [newUrl, setNewUrl] = useState("");
    const [newTitle, setNewTitle] = useState("");

    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated || user?.role !== "PROVIDER") {
            router.push("/login");
            return;
        }

        loadMedia();
    }, [_hasHydrated, isAuthenticated, user, router]);

    async function loadMedia() {
        const token = localStorage.getItem("token");
        try {
            // Get profile ID
            const profileRes = await fetch("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!profileRes.ok) return;
            const profileData = await profileRes.json();

            const res = await fetch(`/api/media?profileId=${profileData.profile.id}`);
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (!newUrl.trim()) {
            toast.error("L'URL est requise");
            return;
        }

        setAdding(true);
        const token = localStorage.getItem("token");

        // Process URL for embeds
        let metadata: { source?: string; embedUrl?: string } | null = null;

        if (newType === "VIDEO" && newUrl.includes("youtube.com")) {
            const videoId = newUrl.match(/v=([^&]+)/)?.[1];
            if (videoId) {
                metadata = { source: "youtube", embedUrl: `https://www.youtube.com/embed/${videoId}` };
            }
        } else if (newType === "AUDIO" && newUrl.includes("soundcloud.com")) {
            metadata = { source: "soundcloud" };
        }

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: newType,
                    url: newUrl.trim(),
                    title: newTitle.trim() || null,
                    metadata,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMedia((prev) => [data.media, ...prev]);
                setNewUrl("");
                setNewTitle("");
                toast.success("Média ajouté !");
            } else {
                toast.error("Erreur lors de l'ajout");
            }
        } catch {
            toast.error("Erreur de connexion");
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id: string) {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/media?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setMedia((prev) => prev.filter((m) => m.id !== id));
                toast.success("Média supprimé");
            }
        } catch {
            toast.error("Erreur lors de la suppression");
        }
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const icons = {
        IMAGE: ImageIcon,
        AUDIO: Music,
        VIDEO: Video,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/provider/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Portfolio</h1>
                    <p className="text-muted-foreground">Gérez vos réalisations</p>
                </div>
            </div>

            {/* Add New Media */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Ajouter un élément
                </h3>

                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <Label>Type</Label>
                        <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value as MediaType)}
                            className="w-full h-10 px-3 rounded-md border border-white/10 bg-white/5"
                        >
                            <option value="AUDIO">🎵 Audio</option>
                            <option value="VIDEO">🎬 Vidéo</option>
                            <option value="IMAGE">📷 Image</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <Label>URL</Label>
                        <Input
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder={
                                newType === "AUDIO" ? "https://soundcloud.com/..." :
                                    newType === "VIDEO" ? "https://youtube.com/watch?v=..." :
                                        "https://..."
                            }
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div>
                        <Label>Titre</Label>
                        <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Optionnel"
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                </div>

                <Button onClick={handleAdd} disabled={adding} className="mt-4">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Ajouter
                </Button>
            </Card>

            {/* Media List */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                <h3 className="font-semibold mb-4">Vos médias ({media.length})</h3>

                {media.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Aucun média dans votre portfolio</p>
                        <p className="text-sm">Ajoutez des liens SoundCloud, YouTube ou des images</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {media.map((item) => {
                            const Icon = icons[item.type];
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {item.title || "Sans titre"}
                                        </p>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary truncate flex items-center gap-1"
                                        >
                                            {item.url.substring(0, 50)}...
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
