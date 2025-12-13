"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    ListMusic,
    Zap,
    Settings,
    CreditCard,
    LogOut,
    Menu,
    X,
    Home,
    ArrowLeft,
    Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProviderSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/provider/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: "/provider/bookings", label: "Réservations", icon: Calendar, badge: "3" },
        { href: "/provider/messages", label: "Messagerie", icon: MessageSquare },
        { href: "/provider/services", label: "Mes Services", icon: ListMusic },
        { href: "/provider/payouts", label: "Mes Revenus", icon: Wallet },
        { href: "/provider/boost", label: "Marketing & Boost", icon: Zap, color: "text-yellow-500" },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
                        <ListMusic className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl">
                        La Kapsul <span className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-1">PRO</span>
                    </span>
                </Link>
                {/* Mobile close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Back to Home Link */}
            <div className="px-4 pt-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à l&apos;accueil
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", link.color)} />
                            {link.label}
                            {link.badge && (
                                <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-pulse">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-white/5">
                    <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Paramètres</p>
                    <Link
                        href="/provider/settings"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            pathname === "/provider/settings"
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        Configuration
                    </Link>
                    <Link
                        href="/provider/billing"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            pathname === "/provider/billing"
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <CreditCard className="h-5 w-5" />
                        Facturation
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <Button variant="outline" asChild className="w-full justify-start gap-3 bg-white/5 border-white/10 hover:bg-white/10">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Home className="h-5 w-5" />
                        Mode Artiste
                    </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </Link>
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button - shown in provider layout header */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden bg-card/80 backdrop-blur-xl border border-white/10 shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-card/95 backdrop-blur-xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-white/10 bg-card/30 backdrop-blur-xl h-screen sticky top-0 flex-col">
                <SidebarContent />
            </aside>
        </>
    );
}

