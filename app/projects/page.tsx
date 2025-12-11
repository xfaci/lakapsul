"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Music, Calendar, Clock, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

type Project = {
    id: string;
    title: string;
    description: string | null;
    status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (_hasHydrated && !isAuthenticated) {
            router.push('/login');
            return;
        }

        async function loadProjects() {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // TODO: Implement projects API
                setProjects([]);
            } finally {
                setLoading(false);
            }
        }

        if (_hasHydrated && isAuthenticated) {
            loadProjects();
        }
    }, [_hasHydrated, isAuthenticated, router]);

    if (!_hasHydrated) {
        return (
            <div className="container py-10">
                <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-8" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'DRAFT': return 'bg-yellow-500/20 text-yellow-500';
            case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-500';
            case 'COMPLETED': return 'bg-green-500/20 text-green-500';
        }
    };

    const getStatusLabel = (status: Project['status']) => {
        switch (status) {
            case 'DRAFT': return 'Brouillon';
            case 'IN_PROGRESS': return 'En cours';
            case 'COMPLETED': return 'Terminé';
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-pink-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="container relative z-10 py-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <FolderOpen className="h-8 w-8 text-purple-500" />
                            Mes Projets
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gérez vos projets musicaux
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau projet
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="h-48 bg-card/30 backdrop-blur-lg animate-pulse" />
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-12 text-center">
                        <FolderOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Aucun projet</h2>
                        <p className="text-muted-foreground mb-6">
                            Vous n&apos;avez pas encore créé de projet musical.
                        </p>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer mon premier projet
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Card key={project.id} className="bg-card/30 backdrop-blur-lg border-white/10 overflow-hidden group hover:border-primary/50 transition-colors">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                                            <Music className="h-6 w-6 text-primary" />
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{project.title}</h3>
                                        {project.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                            {getStatusLabel(project.status)}
                                        </span>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/projects/${project.id}`}>
                                            Voir le projet
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
