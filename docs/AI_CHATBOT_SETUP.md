# 🤖 AI Chatbot Integration Guide

Guide to integrate an AI chatbot for La Kapsul to help users find providers and answer questions.

---

## 1. Recommended: Vercel AI SDK + OpenAI

### Install Dependencies
```bash
npm install ai openai
```

### Environment Variables
```
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

---

## 2. Chatbot Use Cases for La Kapsul

| Use Case | Example Prompt |
|----------|----------------|
| **Find Provider** | "Je cherche un studio à Paris pour enregistrer du rap" |
| **Service Info** | "C'est quoi le mastering ?" |
| **Pricing Questions** | "Combien coûte une session studio ?" |
| **Booking Help** | "Comment réserver un beatmaker ?" |
| **Platform FAQ** | "Comment fonctionne le paiement ?" |

---

## 3. API Route Implementation

Create `app/api/chat/route.ts`:

```typescript
import { OpenAI } from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI();

const SYSTEM_PROMPT = `Tu es l'assistant IA de La Kapsul, une plateforme française 
qui connecte les artistes musicaux avec des prestataires (studios, ingés son, beatmakers).

Ton rôle :
- Aider les utilisateurs à trouver le bon prestataire
- Expliquer les services (enregistrement, mixage, mastering, beatmaking)
- Répondre aux questions sur la plateforme
- Être amical et professionnel

Règles :
- Réponds toujours en français
- Sois concis et utile
- Propose des actions concrètes (ex: "Vous pouvez rechercher sur /search")
- Si tu ne sais pas, dis-le honnêtement`;

export async function POST(request: Request) {
    const { messages } = await request.json();
    
    // Optionally fetch relevant providers for context
    const providers = await prisma.profile.findMany({
        where: { user: { role: 'PROVIDER' } },
        take: 5,
        select: { displayName: true, location: true, skills: true }
    });
    
    const contextMessage = providers.length > 0 
        ? `\n\nPrestataires disponibles: ${JSON.stringify(providers)}`
        : '';
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT + contextMessage },
            ...messages
        ],
        max_tokens: 500,
    });
    
    return Response.json({
        message: response.choices[0].message.content
    });
}
```

---

## 4. Chat UI Component

Create `components/features/chat/chat-widget.tsx`:

```typescript
"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur est survenue." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-card border rounded-lg shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-3 border-b flex justify-between items-center">
                <span className="font-semibold">Assistant La Kapsul</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`text-sm p-2 rounded ${
                        msg.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted mr-4"
                    }`}>
                        {msg.content}
                    </div>
                ))}
                {loading && <div className="text-sm text-muted-foreground">Écriture...</div>}
            </div>
            
            {/* Input */}
            <div className="p-3 border-t flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-background border rounded px-3 py-2 text-sm"
                />
                <Button size="icon" onClick={sendMessage} disabled={loading}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
```

---

## 5. Integration

Add to `app/layout.tsx`:
```tsx
import { ChatWidget } from "@/components/features/chat/chat-widget";

// In the body:
<ChatWidget />
```

---

## 6. Alternative Providers

| Provider | Model | Cost |
|----------|-------|------|
| **OpenAI** | GPT-4o-mini | ~$0.15/1M tokens |
| **Anthropic** | Claude 3.5 Haiku | ~$0.25/1M tokens |
| **Groq** | Llama 3 | Free tier available |
| **Together AI** | Various | Pay-per-use |

---

## 7. Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |

---

## 8. Future Enhancements

- [ ] Stream responses for better UX
- [ ] Save conversation history
- [ ] Provider recommendations based on chat
- [ ] Voice input support
- [ ] Multi-language support
