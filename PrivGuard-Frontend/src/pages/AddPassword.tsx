import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import WebsiteSearch from "@/components/addPassword/WebsiteSearch";
import { toast } from "sonner";
import PasswordField from "@/components/addPassword/PasswordField";
import SelectedServicePreview from "@/components/addPassword/SelectedServicePreview";
import NotesField from "@/components/addPassword/NotesField";
import useGeneratedPassword from "@/hooks/useGeneratedPassword";

interface Service {
    name: string;
    domain: string;
    logo?: string;
}

export default function AddPassword() {
    const { getToken } = useAuth();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [password, setPassword, generatePassword] = useGeneratedPassword();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    const savePassword = async () => {
        if (!selectedService || !password) {
            toast.warning("Please select a service and enter a password");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/add`,
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
                <Card className="rounded-2xl border shadow-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold tracking-tight">Add New Password</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div>
                            {!selectedService ? (
                                <WebsiteSearch onSelect={setSelectedService} />
                            ) : (
                                <SelectedServicePreview
                                    service={selectedService}
                                    onClear={() => setSelectedService(null)}
                                />
                            )}
                        </div>

                        <PasswordField value={password} onChange={setPassword} />

                        <NotesField notes={notes} setNotes={setNotes} />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={generatePassword}
                                className="rounded-xl"
                            >
                                Generate
                            </Button>
                            <Button
                                onClick={savePassword}
                                disabled={loading}
                                className="rounded-xl"
                            >
                                {loading ? "Saving..." : "Save Password"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
