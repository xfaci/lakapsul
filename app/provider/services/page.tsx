"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";

type Service = {
    id: string;
    title: string;
    description: string | null;
    price: number;
    duration: number;
    type: string;
    isActive: boolean;
};

const PRICE_PRESETS = [50, 100, 150, 200, 300, 500];
const DURATION_PRESETS = [30, 60, 90, 120, 180];

export default function ProviderServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(100);
    const [duration, setDuration] = useState<number>(60);
    const [type, setType] = useState<string>("RECORDING");

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    async function loadServices() {
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

    async function createService() {
        if (!title.trim() || price <= 0 || duration <= 0) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setError(null);
        setSaving(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Veuillez vous connecter.");
            setSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
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
            resetForm();
            setSuccess("Offre créée avec succès !");
            setTimeout(() => setSuccess(null), 3000);
        } finally {
            setSaving(false);
        }
    }

    async function deleteService(id: string) {
        if (!confirm("Supprimer cette offre ?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setServices((prev) => prev.filter((s) => s.id !== id));
                setSuccess("Offre supprimée.");
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error("Error deleting service:", err);
        }
    }

    function resetForm() {
        setTitle("");
        setDescription("");
        setPrice(100);
        setDuration(60);
        setType("RECORDING");
        setEditingId(null);
    }

    function adjustPrice(delta: number) {
        setPrice((prev) => Math.max(0, prev + delta));
    }

    function adjustDuration(delta: number) {
        setDuration((prev) => Math.max(15, prev + delta));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mes offres</h1>
                    <p className="text-muted-foreground text-sm">Publiez vos services, tarifs et durées.</p>
                </div>
            </div>

            {/* Success/Error messages */}
            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Create form */}
            <Card className="p-6 space-y-6 bg-card/50 backdrop-blur border-white/10">
                <h2 className="font-semibold text-lg">Créer une offre</h2>

                <div className="grid gap-6">
                    {/* Title & Category row */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Titre de l&apos;offre *</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Session studio 2h, Mix + Master..."
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Catégorie *</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="RECORDING">🎙️ Studio / Recording</SelectItem>
                                    <SelectItem value="MIXING">🎛️ Mixing</SelectItem>
                                    <SelectItem value="MASTERING">🔊 Mastering</SelectItem>
                                    <SelectItem value="BEATMAKING">🎹 Beatmaking</SelectItem>
                                    <SelectItem value="VOCAL_COACHING">🎤 Coaching Vocal</SelectItem>
                                    <SelectItem value="OTHER">📦 Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Price section */}
                    <div className="space-y-3">
                        <Label>Prix (€) *</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0"
                                onClick={() => adjustPrice(-10)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="h-12 text-center text-xl font-bold"
                                min={0}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0"
                                onClick={() => adjustPrice(10)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PRICE_PRESETS.map((p) => (
                                <Button
                                    key={p}
                                    type="button"
                                    variant={price === p ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPrice(p)}
                                    className="min-w-[60px]"
                                >
                                    {p}€
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Duration section */}
                    <div className="space-y-3">
                        <Label>Durée (minutes) *</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0"
                                onClick={() => adjustDuration(-15)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="h-12 text-center text-xl font-bold"
                                min={15}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0"
                                onClick={() => adjustDuration(15)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {DURATION_PRESETS.map((d) => (
                                <Button
                                    key={d}
                                    type="button"
                                    variant={duration === d ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setDuration(d)}
                                >
                                    {d >= 60 ? `${d / 60}h` : `${d}min`}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez votre offre : matériel, livrables, conditions..."
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={createService}
                        disabled={saving || !title.trim() || price <= 0 || duration <= 0}
                        className="h-12 px-8"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-2" />
                                Publier l&apos;offre
                            </>
                        )}
                    </Button>
                    {(title || description || price !== 100 || duration !== 60) && (
                        <Button variant="ghost" onClick={resetForm}>
                            Réinitialiser
                        </Button>
                    )}
                </div>
            </Card>

            {/* Services list */}
            <div className="space-y-4">
                <h2 className="font-semibold">Mes offres publiées ({services.length})</h2>

                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement...
                    </div>
                )}

                {!loading && services.length === 0 && (
                    <Card className="p-8 text-center text-muted-foreground bg-card/30">
                        <p>Aucune offre pour le moment.</p>
                        <p className="text-sm mt-1">Créez votre première offre ci-dessus !</p>
                    </Card>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                        <Card key={service.id} className="p-5 space-y-3 bg-card/50 backdrop-blur border-white/10 hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{service.title}</h3>
                                    {service.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {service.description}
                                        </p>
                                    )}
                                </div>
                                <Badge variant={service.isActive ? "default" : "secondary"}>
                                    {service.isActive ? "Actif" : "Inactif"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-bold text-primary text-lg">{service.price} €</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">
                                        {service.duration >= 60
                                            ? `${Math.floor(service.duration / 60)}h${service.duration % 60 > 0 ? service.duration % 60 : ''}`
                                            : `${service.duration} min`
                                        }
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => deleteService(service.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

