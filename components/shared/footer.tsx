import Link from "next/link";
import { Music } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <Music className="h-6 w-6 text-primary" />
                            <span>La Kapsul</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            La plateforme de référence pour les artistes et professionnels de la musique.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Plateforme</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/search" className="text-muted-foreground hover:text-primary">Trouver un pro</Link></li>
                            <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary">Comment ça marche</Link></li>
                            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Tarifs</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary">Centre d&apos;aide</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary">CGU</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Confidentialité</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Réseaux</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Instagram</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Twitter</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">LinkedIn</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} La Kapsul. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
