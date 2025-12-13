"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Loader2, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";

type UserData = {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    profile: {
        displayName: string | null;
        username: string | null;
        avatarUrl: string | null;
        location: string | null;
    } | null;
    _count: {
        artistBookings: number;
        providerBookings: number;
        reviews: number;
    };
};

type Pagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isAuthenticated || user?.role !== "ADMIN") {
            router.push("/login");
            return;
        }
        fetchUsers(1);
    }, [_hasHydrated, isAuthenticated, user, router]);

    async function fetchUsers(page: number) {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (roleFilter) params.set("role", roleFilter);
            if (search) params.set("search", search);

            const res = await fetch(`/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(userId: string) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

        setDeleting(userId);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
        } finally {
            setDeleting(null);
        }
    }

    function handleSearch() {
        fetchUsers(1);
    }

    const roleColors: Record<string, string> = {
        ARTIST: "bg-blue-500/20 text-blue-400",
        PROVIDER: "bg-purple-500/20 text-purple-400",
        ADMIN: "bg-red-500/20 text-red-400",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground">Total: {pagination.total} utilisateurs</p>
            </div>

            {/* Filters */}
            <Card className="p-4 bg-card/30 backdrop-blur-lg border-white/10">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Rechercher par email ou nom..."
                            className="pl-9 bg-white/5 border-white/10"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setTimeout(() => fetchUsers(1), 0);
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="ARTIST">Artistes</option>
                        <option value="PROVIDER">Prestataires</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    <Button onClick={handleSearch}>Rechercher</Button>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
                                <tr className="text-left text-sm text-muted-foreground">
                                    <th className="p-4">Utilisateur</th>
                                    <th className="p-4">Rôle</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Inscrit le</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={u.profile?.avatarUrl ?? undefined} />
                                                    <AvatarFallback>
                                                        <User className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {u.profile?.displayName || u.profile?.username || "Sans nom"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={roleColors[u.role] || ""}>
                                                {u.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {u.profile?.location || "-"}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => deleteUser(u.id)}
                                                disabled={deleting === u.id}
                                            >
                                                {deleting === u.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination.page} sur {pagination.pages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUsers(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUsers(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
