// src/components/fakeIdentity/TempInboxViewer.tsx
import { useEffect, useState } from "react";
import { fetchTempEmails } from "@/lib/tempMail";

interface TempInboxViewerProps {
    email: string;
}

interface Message {
    id: string;
    from: {
        address: string;
        name?: string;
    };
    subject: string;
    intro: string;
    createdAt: string;
}

export default function TempInboxViewer({ email }: TempInboxViewerProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pollInbox = async () => {
            try {
                const inboxRes = await fetchTempEmails();
                const transformed = inboxRes.map((msg: any) => ({
                    id: msg.id,
                    from: msg.from,
                    subject: msg.subject,
                    intro: msg.intro,
                    createdAt: msg.createdAt,
                }));
                setMessages(transformed);
            } catch (err) {
                console.error("Failed to fetch inbox", err);
            } finally {
                setLoading(false);
            }
        };

        pollInbox();
        const interval = setInterval(pollInbox, 5000);
        return () => clearInterval(interval);
    }, [email]);

    return (
        <div className="bg-muted p-4 rounded-xl w-full">
            <h4 className="text-sm font-semibold mb-2">Inbox ({email})</h4>
            {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
            ) : messages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No emails yet...</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {messages.map((msg) => (
                        <li key={msg.id} className="bg-background p-3 rounded shadow">
                            <p className="font-medium">{msg.subject}</p>
                            <p className="text-xs text-muted-foreground">From: {msg.from?.address}</p>
                            <p className="text-sm mt-1">{msg.intro}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
