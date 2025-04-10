import { useEffect, useState } from "react";
import { fetchTempEmails } from "@/lib/tempMail";

export default function TempInboxViewer({ email }: { email: string }) {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!email) return;
        fetchTempEmails(email).then(setMessages);
    }, [email]);

    return (
        <div className="bg-muted p-3 rounded-xl mt-4">
            <h4 className="text-sm font-semibold mb-2">Inbox ({email})</h4>
            {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No emails yet...</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {messages.map((msg) => (
                        <li key={msg.id} className="bg-background p-2 rounded shadow">
                            <p className="font-medium">{msg.subject}</p>
                            <p className="text-xs text-muted-foreground">From: {msg.from}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
