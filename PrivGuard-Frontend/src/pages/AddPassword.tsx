import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import WebsiteSearch from "@/components/WebsiteSearch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; 

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
    const [notes, setNotes] = useState("");

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast("Password generated");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const savePassword = async () => {
        if (!selectedService || !password) {
            toast.warning("Please select a service and enter a password");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            await axios.post(
                "http://localhost:8080/api/protected/vault/add",
                {
                    service: selectedService.name,
                    domain: selectedService.domain,
                    logo: selectedService.logo,
                    password,
                    notes,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            );

            toast.success("Password saved");

            // Reset state
            setSelectedService(null);
            setPassword("");
            setNotes("");
        } catch (err) {
            console.error("Error saving password:", err);
            toast.error("Failed to save password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto max-w-xl py-10 px-4">
                <Card className="rounded-2xl border shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Add New Password</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Website/Service Search */}
                        <div>
                            
                            {!selectedService ? (
                                <WebsiteSearch onSelect={setSelectedService} />
                            ) : (
                                <div className="mt-2 flex items-center gap-3 rounded-lg border px-4 py-2 bg-muted">
                                    <img
                                        src={selectedService.logo || `https://logo.clearbit.com/${selectedService.domain}`}
                                        alt={selectedService.name}
                                        className="w-8 h-8 rounded-md border"
                                    />
                                    <span className="font-medium">{selectedService.name}</span>
                                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelectedService(null)}>
                                        Change
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter or generate password"
                                    className="pr-20"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                            <Label htmlFor="notes">Notes (optional)</Label>
                        <div>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any extra details here..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={generatePassword}>
                                Generate
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
