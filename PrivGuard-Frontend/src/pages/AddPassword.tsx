import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import WebsiteSearch from "@/components/WebsiteSearch"; // Import website search

interface Service {
    name: string;
    domain: string;
    logo?: string;
}

export default function AddPassword() {
    const { getToken } = useAuth();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    // Generate a random password
    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
    };

    // Copy password to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Save password
    const savePassword = async () => {
        if (!selectedService || !password) return;
        setLoading(true);

        try {
            const token = await getToken();
            await axios.post(
                "http://localhost:8080/api/protected/vault/add",
                { service: selectedService.name, logo: selectedService.logo, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedService(null);
            setPassword("");
        } catch (err) {
            console.error("Error saving password:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto max-w-md py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Add Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Label htmlFor="service">Service / Website</Label>
                            {!selectedService ? (
                                <WebsiteSearch onSelect={setSelectedService} />
                            ) : (
                                <div className="mt-2 flex items-center gap-3 p-2 border rounded-lg">
                                    <img
                                        src={selectedService.logo || `https://logo.clearbit.com/${selectedService.domain}`}
                                        alt={selectedService.name}
                                        className="w-8 h-8 rounded-md border"
                                    />
                                    <span className="text-lg font-medium">{selectedService.name}</span>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="ml-auto text-sm text-red-500 hover:underline"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-4 relative">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative flex items-center">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter or generate password"
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={generatePassword} variant="outline">
                                Generate Password
                            </Button>
                            <Button onClick={savePassword} disabled={loading}>
                                {loading ? "Saving..." : "Save Password"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
