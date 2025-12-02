"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Home, LayoutDashboard, LogOut, Mic2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/dashboard" },
    { icon: Mic2, label: "Mes Services", href: "/services" },
    { icon: Calendar, label: "Réservations", href: "/bookings" },
    { icon: Settings, label: "Paramètres", href: "/settings" },
];

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r bg-muted/10">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Home className="h-6 w-6 text-primary" />
                        <span>La Kapsul</span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === `/provider${item.href}` || (item.href === "/dashboard" && pathname === "/provider");
                        return (
                            <Link
                                key={item.href}
                                href={`/provider${item.href}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 mt-auto border-t">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                        <LogOut className="mr-2 h-5 w-5" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
