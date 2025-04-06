import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Search, Loader2 } from "lucide-react"; // Added Loader2 icon
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function PasswordVault() {
    const { getToken, isLoaded } = useAuth();
    const [passwords, setPasswords] = useState<{ id: number; service: string }[] | null>(null);
    const [filteredPasswords, setFilteredPasswords] = useState<{ id: number; service: string }[] | null>(null);
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
                headers: { "Authorization": `${token}` },
            });

            setPasswords(res.data.vault ?? []);
            setFilteredPasswords(res.data.vault ?? []);
        } catch (err) {
            setError("Error loading passwords. Please try Reloading.");
            console.error("Error fetching passwords:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto max-w-3xl py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold">VAULT</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                type="text"
                                placeholder="Search services..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        {/* Loader instead of Skeletons */}
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="animate-spin text-gray-500" size={32} />
                            </div>
                        ) : filteredPasswords && filteredPasswords.length > 0 ? (
                            <ul className="mt-4 space-y-4">
                                {filteredPasswords.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-card cursor-pointer transition-all duration-200 hover:bg-accent"
                                        onClick={() => navigate(`/password/${entry.id}`)}
                                    >
                                        <div>
                                            <strong className="text-primary">{entry.service}</strong>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <ChevronRight size={18} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No passwords found</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
