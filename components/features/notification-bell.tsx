"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user-store";

type Notification = {
    id: string;
    type: string;
    title: string;
    message: string | null;
    readAt: string | null;
    createdAt: string;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, _hasHydrated } = useUserStore();

    useEffect(() => {
        if (!_hasHydrated || !isAuthenticated) return;

        loadNotifications();

        // Poll every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [_hasHydrated, isAuthenticated]);

    async function loadNotifications() {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error("Error loading notifications:", err);
        }
    }

    async function markAllRead() {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch("/api/notifications", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ markAllRead: true }),
            });
            setUnreadCount(0);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
            );
        } catch (err) {
            console.error("Error marking notifications:", err);
        } finally {
            setLoading(false);
        }
    }

    if (!_hasHydrated || !isAuthenticated) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllRead}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Tout lire
                                </>
                            )}
                        </Button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.slice(0, 10).map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notif.readAt ? "bg-primary/5" : ""
                                    }`}
                            >
                                <div className="font-medium text-sm">{notif.title}</div>
                                {notif.message && (
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                        {notif.message}
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                    {new Date(notif.createdAt).toLocaleDateString("fr-FR")}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
