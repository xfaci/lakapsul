"use client";

import { ProviderSidebar } from "@/components/provider/sidebar";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <ProviderSidebar />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
                {/* Top Header */}
                <header className="h-16 border-b border-white/10 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4 md:hidden">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <span className="font-bold">La Kapsul PRO</span>
                    </div>

                    <div className="hidden md:flex items-center gap-4 w-96">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Rechercher une réservation, un client..."
                                className="w-full pl-9 bg-white/5 border-white/10 rounded-full focus-visible:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                            ST
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
