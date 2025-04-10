import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PasswordDetail {
    id: string;
    service: string;
    domain: string;
    logo?: string;
    notes?: string;
    password: string;
}

export default function PasswordDetailPage() {
    const { id } = useParams();
    const [entry, setEntry] = useState<PasswordDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const { getToken } = useAuth();

    useEffect(() => {
        const fetchPasswordDetail = async () => {
            try {
                const token = await getToken({ template: "new" });
                if (!token) throw new Error("Token retrieval failed");

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/${id}`,
                    { headers: { Authorization: token } }
                );

                setEntry(res.data);
            } catch (err) {
                toast.error("Failed to load password detail");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPasswordDetail();
    }, [id, getToken]);

    const copyPassword = () => {
        if (entry?.password) {
            navigator.clipboard.writeText(entry.password);
            toast.success("Password copied to clipboard");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="text-center pt-20 text-muted-foreground">
                Password not found.
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center pt-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="flex flex-col items-center text-center space-y-2">
                        <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                                alt={entry.service}
                                className="bg-white p-1 object-contain"
                            />
                            <AvatarFallback>{entry.service[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl font-bold">
                            {entry.service}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{entry.domain}</p>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <p className="text-muted-foreground text-sm">
                                {entry.notes || "No notes"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={entry.password}
                                    readOnly
                                />
                                <Button variant="ghost" size="icon" onClick={copyPassword}>
                                    <Copy size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
