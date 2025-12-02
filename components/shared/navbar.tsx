"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Logo } from "@/components/ui/logo";
import { Menu } from "lucide-react";

export function Navbar() {
    const { user } = useUserStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Logo className="h-8 w-8" />
                        <span>La Kapsul</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium">
                        <Link href="/search" className="transition-colors hover:text-primary">
                            Trouver un pro
                        </Link>
                        <Link href="/how-it-works" className="transition-colors hover:text-primary">
                            Comment ça marche
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard">Mon Espace</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="hidden sm:flex">
                                <Link href="/login">Se connecter</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">S'inscrire</Link>
                            </Button>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
