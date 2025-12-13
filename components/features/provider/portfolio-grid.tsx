"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music, Video, ImageIcon, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type Media = {
    id: string;
    type: "IMAGE" | "AUDIO" | "VIDEO";
    url: string;
    title: string | null;
    description: string | null;
    metadata: {
        source?: string; // "youtube", "soundcloud", "upload"
        embedUrl?: string;
    } | null;
};

interface PortfolioGridProps {
    profileId: string;
}

export function PortfolioGrid({ profileId }: PortfolioGridProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/media?profileId=${profileId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMedia(data.media || []);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [profileId]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-muted/30 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (media.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Aucun élément dans le portfolio</p>
            </div>
        );
    }

    // Group by type
    const images = media.filter((m) => m.type === "IMAGE");
    const audio = media.filter((m) => m.type === "AUDIO");
    const videos = media.filter((m) => m.type === "VIDEO");

    return (
        <div className="space-y-8">
            {/* Audio / Tracks */}
            {audio.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Music className="h-5 w-5 text-primary" />
                        Morceaux ({audio.length})
                    </h3>
                    <div className="space-y-3">
                        {audio.map((track) => (
                            <div
                                key={track.id}
                                className="bg-card/30 backdrop-blur border border-white/10 rounded-lg p-4 flex items-center gap-4"
                            >
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Play className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{track.title || "Sans titre"}</p>
                                    {track.description && (
                                        <p className="text-sm text-muted-foreground truncate">{track.description}</p>
                                    )}
                                </div>
                                {track.metadata?.source === "soundcloud" && (
                                    <a
                                        href={track.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-orange-500 flex items-center gap-1"
                                    >
                                        SoundCloud <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Video className="h-5 w-5 text-primary" />
                        Vidéos ({videos.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="bg-card/30 backdrop-blur border border-white/10 rounded-lg overflow-hidden"
                            >
                                {video.metadata?.embedUrl ? (
                                    <div className="aspect-video">
                                        <iframe
                                            src={video.metadata.embedUrl}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-black flex items-center justify-center">
                                        <Play className="h-12 w-12 text-white/50" />
                                    </div>
                                )}
                                {video.title && (
                                    <div className="p-3">
                                        <p className="font-medium truncate">{video.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Images / Photos */}
            {images.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        Photos ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedMedia(img)}
                                className="aspect-square relative rounded-lg overflow-hidden group"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.title || "Photo"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                />
                                {img.title && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm truncate">{img.title}</p>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Image
                            src={selectedMedia.url}
                            alt={selectedMedia.title || "Photo"}
                            width={1200}
                            height={800}
                            className="object-contain max-h-[90vh]"
                        />
                        {selectedMedia.title && (
                            <p className="absolute bottom-4 left-4 text-white text-lg font-medium">
                                {selectedMedia.title}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
