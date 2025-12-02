"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function SearchFilters() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filtres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Location */}
                    <div className="space-y-2">
                        <Label>Localisation</Label>
                        <Input placeholder="Paris, Lyon..." />
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <div className="flex flex-wrap gap-2">
                            {["Studio", "Mixage", "Mastering", "Beatmaking", "Coaching"].map((cat) => (
                                <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Prix / session</Label>
                            <span className="text-sm text-muted-foreground">0€ - 1000€</span>
                        </div>
                        <Slider defaultValue={[500]} max={1000} step={10} />
                    </div>

                    {/* Reset */}
                    <Button variant="ghost" className="w-full">
                        <X className="mr-2 h-4 w-4" /> Réinitialiser
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
