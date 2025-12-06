"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MessageSquare, ListMusic, Zap, Settings, CreditCard, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProviderSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/provider/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: "/provider/bookings", label: "Réservations", icon: Calendar, badge: "3" },
        { href: "/provider/messages", label: "Messagerie", icon: MessageSquare },
        { href: "/provider/services", label: "Mes Services", icon: ListMusic },
        { href: "/provider/boost", label: "Marketing & Boost", icon: Zap, color: "text-yellow-500" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-card/95 backdrop-blur-xl md:bg-card/30 md:static md:h-screen md:sticky md:top-0 hidden md:flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <ListMusic className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl">
                        La Kapsul <span className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-1">PRO</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", link.color)} />
                            {link.label}
                            {link.badge && (
                                <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-white/5">
                    <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">PARAMÈTRES</p>
                    <Link
                        href="/provider/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                        <Settings className="h-5 w-5" />
                        Configuration
                    </Link>
                    <Link
                        href="/provider/billing"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                    >
                        <CreditCard className="h-5 w-5" />
                        Facturation
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <Button variant="ghost" asChild className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard">
                        <LogOut className="h-5 w-5" />
                        Retour mode Artiste
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
