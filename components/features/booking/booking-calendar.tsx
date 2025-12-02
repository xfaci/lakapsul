"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingCalendarProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function BookingCalendar({ date, setDate }: BookingCalendarProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Choisir une date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                />
            </CardContent>
        </Card>
    );
}
