"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string | null;
    name?: string | null;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

// Generate a consistent color based on the name
function getInitialsColor(name: string): string {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-emerald-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-sky-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-violet-500",
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-pink-500",
        "bg-rose-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
    if (!name) return "?";

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
};

export function UserAvatar({ src, name, className, size = "md" }: UserAvatarProps) {
    const initials = getInitials(name || "");
    const colorClass = getInitialsColor(name || "User");

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            {src && <AvatarImage src={src} alt={name || "User"} />}
            <AvatarFallback className={cn(colorClass, "text-white font-semibold")}>
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
