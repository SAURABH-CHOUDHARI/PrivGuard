import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "./Navbar";

// HOC that handles the passkey authentication and registration
export function withPasskeyAuth<P>(WrappedComponent: React.ComponentType<P>) {
    return function PasskeyAuthHOC(props: P & React.JSX.IntrinsicAttributes) {
        const { getToken } = useAuth();
        const [loading, setLoading] = useState(false);
        const [authenticated, setAuthenticated] = useState(false);
        const [error, setError] = useState("");

        // Registration flow
        const handleRegister = async () => {
            setLoading(true);
            try {
                const token = await getToken({ template: "new" });

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/register/start`,
                    {},
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                const attResp = await startRegistration(res.data.publicKey.publicKey);

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/register/finish`,
                    attResp,
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                toast.success("Passkey registered successfully!");
            } catch (err: any) {
                const msg = err?.response?.data?.error || err.message || "Registration failed";
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        // Login flow
        const handleLogin = async () => {
            setLoading(true);
            try {
                const token = await getToken({ template: "new" });

                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/login/start`,
                    {},
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                const authResp = await startAuthentication(data.publicKey);

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/login/finish`,
                    authResp,
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                toast.success("Logged in with passkey!");
                setAuthenticated(true);
            } catch (err: any) {
                const msg = err?.response?.data?.error || err.message || "Login failed";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        // Render logic based on the state
        if (loading) {
            return (
                <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                    <CardContent className="p-6 space-y-4 text-center">
                        <h2 className="text-lg font-semibold">Verifying passkey...</h2>
                        <p>Please complete the authentication on your device.</p>
                    </CardContent>
                </Card>
            );
        }

        if (error && !authenticated) {
            return (
                <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                    <CardContent className="p-6 space-y-4 text-center">
                        <h2 className="text-lg font-semibold text-red-600">Authentication Failed</h2>
                        <p>{error}</p>
                        <Button onClick={handleLogin} className="w-full">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        // Once authenticated, render the wrapped component
        if (authenticated) {
            return <WrappedComponent {...props} />;
        }

        return (
            <>
            <Navbar/>
            <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Secure your account</h2>
                    <div className="space-y-2">
                        <Button onClick={handleRegister} disabled={loading} className="w-full">
                            {loading ? "Registering..." : "Register Passkey"}
                        </Button>
                        <Button onClick={handleLogin} disabled={loading} variant="outline" className="w-full">
                            {loading ? "Authenticating..." : "Login with Passkey"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </>
        );
    };
}
