"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Réservations</h1>
                <p className="text-muted-foreground">Suivez vos demandes et sessions à venir.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Toutes les réservations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Session Studio A</div>
                                    <div className="text-sm text-muted-foreground">Avec Jean Dupont • 12 Oct, 14:00 - 18:00</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={i === 1 ? "default" : "secondary"}>
                                        {i === 1 ? "Confirmé" : "En attente"}
                                    </Badge>
                                    <Button variant="outline" size="sm">Détails</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
