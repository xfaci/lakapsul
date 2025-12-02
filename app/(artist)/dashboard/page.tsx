"use client";

import { ArtistStats } from "@/components/features/dashboard/artist-stats";
import { RecentBookings } from "@/components/features/dashboard/recent-bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                    <p className="text-muted-foreground">Gérez vos projets et réservations.</p>
                </div>
                <Button asChild size="lg" className="rounded-full">
                    <Link href="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Trouver un pro
                    </Link>
                </Button>
            </div>

            <ArtistStats />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Projets en cours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                            <p>Aucun projet actif pour le moment.</p>
                            <Button variant="link" asChild>
                                <Link href="/search">Commencer un projet</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div className="col-span-3">
                    <RecentBookings />
                </div>
            </div>
        </div>
    );
}
