"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Rocket, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

const ARTIST_PLANS = [
    {
        id: "FREE",
        name: "Free",
        price: "0€",
        period: "",
        description: "Pour débuter",
        features: [
            "3 réservations/mois",
            "10 messages/jour",
            "Commission 10%",
            "Profil basique",
        ],
        icon: Sparkles,
        popular: false,
        color: "from-gray-500 to-gray-600",
    },
    {
        id: "MID",
        name: "Kapsul+",
        price: "9€",
        period: "/4 semaines",
        hook: "1ère semaine à 1€",
        description: "Pour les artistes actifs",
        features: [
            "Réservations illimitées",
            "Messages illimités",
            "Commission 8%",
            "Badge Membre+",
            "Support prioritaire",
        ],
        icon: Zap,
        popular: true,
        color: "from-primary to-purple-600",
    },
    {
        id: "PRO",
        name: "Kapsul Pro",
        price: "19€",
        period: "/4 semaines",
        description: "Pour les pros",
        features: [
            "Tout Kapsul+",
            "Commission 5%",
            "Badge Pro doré",
            "1 boost gratuit/mois",
            "Accès avant-première",
            "Stats projets",
        ],
        icon: Crown,
        popular: false,
        color: "from-yellow-500 to-orange-600",
    },
];

const PROVIDER_PLANS = [
    {
        id: "FREE",
        name: "Free",
        price: "0€",
        period: "",
        description: "Pour démarrer",
        features: [
            "3 services max",
            "5 réservations/mois",
            "Commission 10%",
            "Profil basique",
        ],
        icon: Sparkles,
        popular: false,
        color: "from-gray-500 to-gray-600",
    },
    {
        id: "MID",
        name: "Studio+",
        price: "29€",
        period: "/4 semaines",
        hook: "1er mois à 9€",
        description: "Pour les studios",
        features: [
            "10 services",
            "Réservations illimitées",
            "Commission 8%",
            "Badge vérifié ✓",
            "Stats détaillées",
            "Calendrier intégré",
        ],
        icon: Zap,
        popular: true,
        color: "from-primary to-purple-600",
    },
    {
        id: "PRO",
        name: "Studio Elite",
        price: "59€",
        period: "/4 semaines",
        description: "Pour les leaders",
        features: [
            "Tout Studio+",
            "Services illimités",
            "Commission 5%",
            "Badge Elite ⭐",
            "Top des recherches",
            "2 boosts gratuits/mois",
            "Support VIP 24h",
        ],
        icon: Crown,
        popular: false,
        color: "from-yellow-500 to-orange-600",
    },
];

const BOOSTS = [
    { id: "STANDARD", name: "Boost Standard", price: "5€", duration: "24h", effect: "Top 10 des recherches" },
    { id: "PREMIUM", name: "Boost Premium", price: "15€", duration: "7 jours", effect: "Top 5 + Recommandé" },
    { id: "MEGA", name: "Mega Boost", price: "35€", duration: "30 jours", effect: "Top 3 + Notification" },
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [tab, setTab] = useState<"artist" | "provider">("artist");
    const { user, isAuthenticated } = useUserStore();
    const router = useRouter();

    const plans = tab === "artist" ? ARTIST_PLANS : PROVIDER_PLANS;

    async function handleSubscribe(planId: string) {
        if (!isAuthenticated) {
            router.push("/signup");
            return;
        }

        if (planId === "FREE") return;

        setLoading(planId);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type: "subscription", plan: planId }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Checkout error:", err);
        } finally {
            setLoading(null);
        }
    }

    async function handleBoost(boostId: string) {
        if (!isAuthenticated) {
            router.push("/signup");
            return;
        }

        setLoading(`boost-${boostId}`);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type: "boost", plan: boostId }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Boost checkout error:", err);
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
            </div>

            <div className="container relative z-10 py-16 space-y-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                        Tarifs simples, sans surprise
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Choisissez votre{" "}
                        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            Kapsul
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Des formules adaptées à vos besoins, facturées toutes les 4 semaines
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="flex justify-center">
                    <div className="inline-flex rounded-full bg-muted/50 p-1">
                        <button
                            onClick={() => setTab("artist")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${tab === "artist"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Je suis Artiste
                        </button>
                        <button
                            onClick={() => setTab("provider")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${tab === "provider"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Je suis Prestataire
                        </button>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => {
                        const Icon = plan.icon;
                        return (
                            <Card
                                key={plan.id}
                                className={`relative bg-card/30 backdrop-blur-lg border-white/10 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular ? "ring-2 ring-primary" : ""
                                    }`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground px-4">
                                            Populaire
                                        </Badge>
                                    </div>
                                )}

                                {plan.hook && (
                                    <div className="absolute -top-3 right-4">
                                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                            {plan.hook}
                                        </Badge>
                                    </div>
                                )}

                                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                                    variant={plan.popular ? "default" : "outline"}
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading === plan.id || plan.id === "FREE"}
                                >
                                    {loading === plan.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : plan.id === "FREE" ? (
                                        "Plan actuel"
                                    ) : (
                                        "Choisir ce plan"
                                    )}
                                </Button>
                            </Card>
                        );
                    })}
                </div>

                {/* Boosts section (only for providers) */}
                {(tab === "provider" || user?.role === "PROVIDER") && (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                <Rocket className="h-6 w-6 text-primary" />
                                Boostez votre visibilité
                            </h2>
                            <p className="text-muted-foreground">
                                Apparaissez en tête des recherches
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {BOOSTS.map((boost) => (
                                <Card
                                    key={boost.id}
                                    className="bg-card/30 backdrop-blur-lg border-white/10 p-6 hover:bg-card/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold">{boost.name}</h3>
                                            <p className="text-sm text-muted-foreground">{boost.duration}</p>
                                        </div>
                                        <span className="text-2xl font-bold text-primary">{boost.price}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">{boost.effect}</p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleBoost(boost.id)}
                                        disabled={loading === `boost-${boost.id}`}
                                    >
                                        {loading === `boost-${boost.id}` ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Activer"
                                        )}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Commission info */}
                <div className="max-w-2xl mx-auto text-center">
                    <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                        <h3 className="font-semibold mb-2">Commission sur les réservations</h3>
                        <p className="text-sm text-muted-foreground">
                            Une commission est prélevée sur chaque transaction : <strong>10%</strong> (Free),{" "}
                            <strong>8%</strong> (Mid), <strong>5%</strong> (Pro).
                            <br />
                            Les prestataires reçoivent leur paiement <strong>sous 24h</strong> après confirmation.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
