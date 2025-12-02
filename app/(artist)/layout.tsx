import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, Mic2, Music2, Settings, User } from "lucide-react";
import Link from "next/link";

export default function ArtistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/10 bg-card/30 backdrop-blur-xl lg:flex fixed h-full z-50">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600" />
                        La Kapsul
                    </Link>
                </div>
                <nav className="flex-1 space-y-2 px-4 py-4">
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            Tableau de bord
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/booking">
                            <Music2 className="h-4 w-4" />
                            Mes réservations
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/projects">
                            <Mic2 className="h-4 w-4" />
                            Mes projets
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/profile">
                            <User className="h-4 w-4" />
                            Profil
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <Link href="/settings">
                            <Settings className="h-4 w-4" />
                            Paramètres
                        </Link>
                    </Button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <Card className="bg-gradient-to-br from-primary/20 to-purple-600/20 border-none">
                        <div className="p-4">
                            <h4 className="font-semibold text-sm mb-1">Besoin d&apos;aide ?</h4>
                            <p className="text-xs text-muted-foreground mb-3">Contactez le support 24/7</p>
                            <Button size="sm" className="w-full text-xs">Support</Button>
                        </div>
                    </Card>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-64">
                <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
