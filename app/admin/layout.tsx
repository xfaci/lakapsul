"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    Settings,
    Home,
    ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: "/admin/users", label: "Utilisateurs", icon: Users },
        { href: "/admin/providers", label: "Prestataires", icon: ShieldCheck },
        { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
        { href: "/admin/settings", label: "Paramètres", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-card/30 backdrop-blur-xl h-screen sticky top-0 flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="font-bold text-xl">
                            Admin <span className="text-xs font-normal bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full ml-1">Panel</span>
                        </span>
                    </Link>
                </div>

                <div className="px-4 pt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour au site
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                    isActive
                                        ? "bg-red-600/10 text-red-400 font-medium"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Button variant="outline" asChild className="w-full justify-start gap-3">
                        <Link href="/dashboard">
                            <Home className="h-5 w-5" />
                            Mode Utilisateur
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
