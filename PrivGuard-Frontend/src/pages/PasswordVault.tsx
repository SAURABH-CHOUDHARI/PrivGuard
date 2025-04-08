import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";


interface VaultEntry {
    id: string;
    service: string;
    domain: string;
    logo?: string;
    notes?: string;
    password: string;
}

export default function PasswordVault() {
    const { getToken, isLoaded } = useAuth();
    const [passwords, setPasswords] = useState<VaultEntry[] | null>(null);
    const [filteredPasswords, setFilteredPasswords] = useState<VaultEntry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded) fetchPasswords();
    }, [isLoaded]);

    useEffect(() => {
        if (!passwords) return;
        setFilteredPasswords(
            passwords.filter((entry) =>
                entry.service.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, passwords]);

    const fetchPasswords = async () => {
        setLoading(true);
        setError("");

        try {
            const token = await getToken();
            if (!token) {
                setError("Authentication failed. Please log in again.");
                return;
            }

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault`, {
                headers: { Authorization: `${token}` },
            });

            const vaultData = res.data.vault ?? [];
            setPasswords(vaultData);
            setFilteredPasswords(vaultData);

            if (vaultData.length > 0) {
                localStorage.setItem("user_id", vaultData[0].id);
            }

            toast.success("Vault loaded successfully");
        } catch (err) {
            toast.error("Failed to load vault");
            setError("Error loading passwords. Please try Reloading.");
            console.error("Error fetching passwords:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto max-w-3xl py-8 px-4">
                <Card>
                    <CardHeader className="flex flex-col  items-center justify-between">
                        <CardTitle className="text-2xl mb-2 font-bold">VAULT</CardTitle>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                type="text"
                                placeholder="Search services..."
                                className="pl-10 "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        {loading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="animate-spin text-gray-500" size={32} />
                            </div>
                        ) : filteredPasswords && filteredPasswords.length > 0 ? (
                            <ul className="mt-4 space-y-4">
                                {filteredPasswords.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm cursor-pointer transition-all hover:bg-accent/50"
                                        onClick={() => navigate(`/password/${entry.id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage
                                                    src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                                                    alt={entry.service}
                                                    className="object-contain bg-white p-1"
                                                />
                                                <AvatarFallback>{entry.service[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-base font-medium text-primary">{entry.service}</p>
                                                <p className="text-xs text-muted-foreground">{entry.domain}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <ChevronRight size={28} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-6">No passwords found</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
