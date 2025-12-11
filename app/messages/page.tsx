"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";

type Conversation = {
    id: string;
    participant: {
        id: string;
        displayName: string | null;
        avatarUrl: string | null;
    };
    lastMessage: string;
    lastMessageAt: string;
    unread: boolean;
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    sender: {
        profile: {
            displayName: string | null;
            avatarUrl: string | null;
        } | null;
    };
};

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        loadConversations();
    }, [_hasHydrated, isAuthenticated, router]);

    async function loadConversations() {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/conversations", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
            }
        } catch (err) {
            console.error("Error loading conversations:", err);
        } finally {
            setLoading(false);
        }
    }

    async function loadMessages(conversationId: string) {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`/api/messages?conversationId=${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    }

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedConv || !newMessage.trim() || sending) return;

        setSending(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    conversationId: selectedConv.id,
                    content: newMessage.trim(),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, data.message]);
                setNewMessage("");
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    }

    function selectConversation(conv: Conversation) {
        setSelectedConv(conv);
        loadMessages(conv.id);
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="container max-w-5xl py-10">
                <div className="h-[600px] bg-muted/30 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="container relative z-10 max-w-5xl py-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                        <p className="text-muted-foreground">
                            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <Card className="bg-card/30 backdrop-blur-lg border-white/10 overflow-hidden">
                    <div className="grid md:grid-cols-3 h-[600px]">
                        {/* Conversations list */}
                        <div className={`border-r border-white/10 overflow-y-auto ${selectedConv ? "hidden md:block" : ""}`}>
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm">Aucune conversation</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => selectConversation(conv)}
                                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedConv?.id === conv.id ? "bg-white/10" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <UserAvatar
                                                    src={conv.participant.avatarUrl}
                                                    name={conv.participant.displayName}
                                                    size="md"
                                                />
                                                {conv.unread && (
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">
                                                    {conv.participant.displayName || "Utilisateur"}
                                                </div>
                                                <div className="text-sm text-muted-foreground truncate">
                                                    {conv.lastMessage || "Nouvelle conversation"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Messages area */}
                        <div className={`md:col-span-2 flex flex-col ${!selectedConv ? "hidden md:flex" : ""}`}>
                            {selectedConv ? (
                                <>
                                    {/* Header */}
                                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden"
                                            onClick={() => setSelectedConv(null)}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <UserAvatar
                                            src={selectedConv.participant.avatarUrl}
                                            name={selectedConv.participant.displayName}
                                            size="md"
                                        />
                                        <div>
                                            <div className="font-medium">
                                                {selectedConv.participant.displayName || "Utilisateur"}
                                            </div>
                                            <Link
                                                href={`/provider/${selectedConv.participant.id}`}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Voir le profil
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((msg) => {
                                            const isOwn = msg.senderId === user?.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${isOwn
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-white/10"
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Écrire un message..."
                                                className="bg-white/5 border-white/10"
                                                disabled={sending}
                                            />
                                            <Button type="submit" disabled={sending || !newMessage.trim()}>
                                                {sending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            Sélectionnez une conversation
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
