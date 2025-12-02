"use client";

import { BookingCalendar } from "@/components/features/booking/booking-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface BookingPageProps {
    params: {
        id: string;
    };
}

export default function BookingPage({ params }: BookingPageProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const service = MOCK_SERVICES.find((s) => s.id === params.id);

    if (!service) {
        notFound();
    }

    const handleBooking = () => {
        toast.success("Réservation confirmée !", {
            description: `Votre session pour ${service.name} a été réservée.`,
        });
    };

    return (
        <div className="container py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Finaliser la réservation</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <BookingCalendar date={date} setDate={setDate} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Créneau horaire</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {["10:00", "14:00", "18:00"].map((time) => (
                                    <Button key={time} variant="outline" className="w-full">
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Récapitulatif</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>

                            <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2" />
                                {Math.floor(service.duration / 60)}h{service.duration % 60 > 0 ? service.duration % 60 : ''}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-medium">
                                    <span>Date</span>
                                    <span>{date ? format(date, "d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-2">
                                    <span>Total</span>
                                    <span>{service.price}€</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleBooking} disabled={!date}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirmer et Payer
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
