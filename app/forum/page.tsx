"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Plus, TrendingUp, Users, Hash } from "lucide-react";
import Link from "next/link";

export default function ForumPage() {
    const categories = [
        { name: "Général", count: 120, icon: Hash },
        { name: "Matériel & Studio", count: 85, icon: MessageSquare },
        { name: "Collabs", count: 230, icon: Users },
        { name: "Feedback", count: 45, icon: TrendingUp },
    ];

    const threads = [
        {
            id: 1,
            title: "Quel micro pour commencer le rap ?",
            author: "YoungRookie",
            category: "Matériel & Studio",
            replies: 12,
            views: 340,
            lastActivity: "Il y a 2h",
        },
        {
            id: 2,
            title: "Cherche beatmaker pour projet Trap/Drill",
            author: "LilFlex",
            category: "Collabs",
            replies: 5,
            views: 120,
            lastActivity: "Il y a 4h",
        },
        {
            id: 3,
            title: "Avis sur mon dernier mix",
            author: "MixMaster",
            category: "Feedback",
            replies: 8,
            views: 210,
            lastActivity: "Il y a 1j",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Forum Communautaire</h1>
                    <p className="text-muted-foreground">Échangez avec d'autres passionnés de musique.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Sujet
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher..." className="pl-9" />
                    </div>

                    <Card className="p-4">
                        <h3 className="font-semibold mb-4">Catégories</h3>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href="#"
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <cat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {cat.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-4">
                    {threads.map((thread) => (
                        <Link key={thread.id} href={`/forum/thread-${thread.id}`}>
                            <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {thread.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">par {thread.author} • {thread.lastActivity}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg">{thread.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <div className="flex items-center gap-1 text-sm">
                                            <MessageSquare className="h-4 w-4" />
                                            {thread.replies}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Users className="h-4 w-4" />
                                            {thread.views}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
