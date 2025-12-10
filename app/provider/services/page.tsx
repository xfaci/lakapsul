"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Service = {
    id: string;
    title: string;
    description: string | null;
    price: number;
    duration: number;
    type: string;
    isActive: boolean;
};

export default function ProviderServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [duration, setDuration] = useState<number>(60);
    const [type, setType] = useState<string>("RECORDING");

    useEffect(() => {
        async function load() {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Veuillez vous connecter.");
                    setLoading(false);
                    return;
                }
                const res = await fetch("/api/services", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Impossible de charger les services.");
                } else {
                    setServices(data.services);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function createService() {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Veuillez vous connecter.");
            return;
        }
        const res = await fetch("/api/services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description,
                price: Number(price),
                duration: Number(duration),
                type,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Impossible de créer le service.");
            return;
        }
        setServices((prev) => [data.service, ...prev]);
        setTitle("");
        setDescription("");
        setPrice(0);
        setDuration(60);
        setType("RECORDING");
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mes services</h1>
                    <p className="text-muted-foreground text-sm">Publiez vos offres, tarifs et durées.</p>
                </div>
            </div>

            <Card className="p-6 space-y-4">
                <h2 className="font-semibold">Créer une offre</h2>
                {error && <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-2">{error}</div>}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Titre</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session studio, mixage..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RECORDING">Studio / Recording</SelectItem>
                                <SelectItem value="MIXING">Mixing</SelectItem>
                                <SelectItem value="MASTERING">Mastering</SelectItem>
                                <SelectItem value="BEATMAKING">Beatmaking</SelectItem>
                                <SelectItem value="VOCAL_COACHING">Coaching Vocal</SelectItem>
                                <SelectItem value="OTHER">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Prix (€)</Label>
                        <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Durée (minutes)</Label>
                        <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Matériel, conditions, livrables..."
                        />
                    </div>
                </div>
                <Button onClick={createService} disabled={loading || !title || !price || !duration}>
                    Publier
                </Button>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {loading && <div className="text-muted-foreground">Chargement...</div>}
                {!loading && services.length === 0 && (
                    <Card className="p-6 text-muted-foreground text-sm">Aucun service pour le moment.</Card>
                )}
                {services.map((service) => (
                    <Card key={service.id} className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">{service.title}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? "Actif" : "Brouillon"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{service.price} €</span>
                            <span>•</span>
                            <span>{service.duration} min</span>
                            <span>•</span>
                            <span>{service.type}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
