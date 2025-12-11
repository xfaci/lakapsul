"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

type PopupType = "subscription" | "boost";

interface SubscriptionPopupProps {
    type?: PopupType;
    trigger?: "login" | "booking" | "limit";
    onClose: () => void;
}

export function SubscriptionPopup({ type = "subscription", trigger = "login", onClose }: SubscriptionPopupProps) {
    const [visible, setVisible] = useState(false);
    const { user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        // Animate in
        setTimeout(() => setVisible(true), 100);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleUpgrade = () => {
        router.push("/pricing");
        handleClose();
    };

    const isProvider = user?.role === "PROVIDER";

    const messages = {
        login: {
            title: "Bienvenue sur La Kapsul ! 🎉",
            subtitle: isProvider
                ? "Démarrez avec Studio+ et boostez votre visibilité"
                : "Passez à Kapsul+ pour des réservations illimitées",
            hook: isProvider ? "Premier mois à 9€" : "Première semaine à 1€",
        },
        booking: {
            title: "Vous avez atteint la limite 📊",
            subtitle: "Passez à l'abonnement supérieur pour continuer",
            hook: "Commission réduite dès aujourd'hui",
        },
        limit: {
            title: "Besoin de plus ? 🚀",
            subtitle: "Débloquez toutes les fonctionnalités premium",
            hook: "Essayez gratuitement pendant 7 jours",
        },
    };

    const { title, subtitle, hook } = messages[trigger];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
                }`}
            onClick={handleClose}
        >
            <div
                className={`relative w-full max-w-md bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-2xl border border-white/10 transition-all duration-500 ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Animated gradient background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/30 rounded-full blur-[80px] animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative text-center">
                    {/* Icon stack */}
                    <div className="flex justify-center gap-2 mb-6">
                        <div className="h-12 w-12 rounded-xl bg-gray-500/20 flex items-center justify-center animate-bounce" style={{ animationDelay: "0ms" }}>
                            <Sparkles className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center animate-bounce" style={{ animationDelay: "100ms" }}>
                            <Zap className="h-7 w-7 text-primary" />
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center animate-bounce" style={{ animationDelay: "200ms" }}>
                            <Crown className="h-6 w-6 text-yellow-500" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <p className="text-muted-foreground mb-4">{subtitle}</p>

                    {/* Hook badge */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
                        <Sparkles className="h-4 w-4" />
                        {hook}
                    </div>

                    {/* Features preview */}
                    <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-sm font-medium">Commission</div>
                            <div className="text-primary font-bold">Jusqu'à -50%</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-sm font-medium">Réservations</div>
                            <div className="text-primary font-bold">Illimitées</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Button onClick={handleUpgrade} className="w-full mb-3" size="lg">
                        Voir les offres
                    </Button>

                    <button
                        onClick={handleClose}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Plus tard
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook to trigger popup based on conditions
export function useSubscriptionPopup() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupTrigger, setPopupTrigger] = useState<"login" | "booking" | "limit">("login");

    const triggerPopup = (trigger: "login" | "booking" | "limit" = "login") => {
        setPopupTrigger(trigger);
        setShowPopup(true);
    };

    const closePopup = () => setShowPopup(false);

    return { showPopup, popupTrigger, triggerPopup, closePopup };
}
