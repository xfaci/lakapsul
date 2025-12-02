"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function ServicesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Services</h1>
                    <p className="text-muted-foreground">Gérez les services que vous proposez aux artistes.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau service
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Service Card Example */}
                <Card>
                    <CardHeader>
                        <CardTitle>Studio A - Enregistrement</CardTitle>
                        <CardDescription>Cabine insonorisée, Micro Neumann U87</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-4">30€ /h</div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full">Modifier</Button>
                            <Button variant="destructive" size="icon">
                                <span className="sr-only">Supprimer</span>
                                ×
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-dashed flex items-center justify-center h-[200px] hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Plus className="h-8 w-8 mb-2" />
                        <span>Ajouter un service</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
