"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";

type Availability = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
};

const DAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface CalendarViewProps {
    profileId: string;
}

export function CalendarView({ profileId }: CalendarViewProps) {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/availability?profileId=${profileId}`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailability(data.availability || []);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [profileId]);

    if (loading) {
        return (
            <div className="animate-pulse h-40 bg-muted/30 rounded-lg" />
        );
    }

    // Order days starting from Monday
    const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Horaires d&apos;ouverture</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {orderedDays.map((dayNum) => {
                    const slot = availability.find((a) => a.dayOfWeek === dayNum);
                    const isOpen = slot?.isActive;

                    return (
                        <div
                            key={dayNum}
                            className={`text-center p-2 rounded-lg text-xs ${isOpen
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted/30 text-muted-foreground"
                                }`}
                        >
                            <div className="font-medium mb-1">{DAYS_SHORT[dayNum]}</div>
                            {isOpen && slot ? (
                                <div className="text-[10px] leading-tight">
                                    {slot.startTime}
                                    <br />
                                    {slot.endTime}
                                </div>
                            ) : (
                                <div className="text-[10px]">Fermé</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Today's status */}
            {(() => {
                const today = new Date().getDay();
                const todaySlot = availability.find((a) => a.dayOfWeek === today);

                if (todaySlot?.isActive) {
                    const now = new Date();
                    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                    const isOpen = currentTime >= todaySlot.startTime && currentTime <= todaySlot.endTime;

                    return (
                        <div className={`flex items-center gap-2 text-sm ${isOpen ? "text-green-500" : "text-yellow-500"}`}>
                            <Clock className="h-4 w-4" />
                            <span>
                                {isOpen
                                    ? `Ouvert maintenant • Ferme à ${todaySlot.endTime}`
                                    : `Fermé • Ouvre à ${todaySlot.startTime}`
                                }
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Fermé aujourd&apos;hui</span>
                    </div>
                );
            })()}
        </div>
    );
}
