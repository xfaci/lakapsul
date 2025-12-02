import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Service } from "@/types";
import { Clock, Info } from "lucide-react";
import Link from "next/link";

interface ServiceListProps {
    services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
    return (
        <div className="grid gap-4">
            {services.map((service) => (
                <Card key={service.id} className="flex flex-col md:flex-row items-center overflow-hidden">
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">{service.name}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{service.price}€</div>
                                {service.duration > 0 && (
                                    <div className="flex items-center justify-end text-sm text-muted-foreground mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {Math.floor(service.duration / 60)}h{service.duration % 60 > 0 ? service.duration % 60 : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardFooter className="p-6 pt-0 md:pt-6 bg-muted/50 md:bg-transparent md:border-l h-full flex items-center justify-center w-full md:w-auto">
                        <Button size="lg" className="w-full md:w-auto" asChild>
                            <Link href={`/booking/${service.id}`}>
                                Réserver
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
