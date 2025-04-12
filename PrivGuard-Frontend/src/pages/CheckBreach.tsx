// src/pages/CheckBreaches.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function CheckBreaches() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [breaches, setBreaches] = useState<string[] | null>(null);
    const [error, setError] = useState("");

    const handleCheck = async () => {
        setLoading(true);
        setBreaches(null);
        setError("");

        try {
            const res = await axios.get(`https://api.xposedornot.com/v1/check-email/${email}`);
            const result = res.data;
            if (result.breaches && result.breaches.length > 0) {
                setBreaches(result.breaches[0]);
            } else {
                setBreaches([]);
            }
        } catch (err) {
            setError("Failed to check breaches. Make sure the email is correct.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">🔍 Check Email Breaches</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Enter email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button onClick={handleCheck} disabled={loading || !email}>
                            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                            Check
                        </Button>
                    </CardContent>
                </Card>

                {breaches && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Breach Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {breaches.length === 0 ? (
                                <div className="flex items-center gap-3 text-green-600">
                                    <ShieldCheck /> <p>No breaches found for this email 🎉</p>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {breaches.map((b) => (
                                        <li
                                            key={b}
                                            className="flex items-center gap-2 text-red-600 text-sm"
                                        >
                                            <ShieldAlert size={18} /> {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                )}

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
            </div>
        </>
    );
}
