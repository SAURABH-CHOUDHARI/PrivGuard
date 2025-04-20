import { useEffect, useState } from "react";
import { useTOTP } from "@/context/TOTPContext";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "./Navbar";

interface TOTPGuardProps {
    children: React.ReactNode;
}

const TOTPGuard = ({ children }: TOTPGuardProps) => {
    const { isTOTPEnabled } = useTOTP();
    const { getToken } = useAuth();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        // auto-check and maybe redirect logic could go here
    }, [isTOTPEnabled]);


    const handleVerify = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/verify`,
                { code },
                {
                    headers: { Authorization: token },
                    withCredentials: true,
                }
            );
            if (data.message) {
                toast.success("TOTP Verified");
                setVerified(true);
            } else {
                toast.error("Invalid code");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isTOTPEnabled) {
        return (
            <div className="max-w-md mx-auto text-center p-6 mt-10">
                <h2 className="text-xl font-semibold mb-4">Set up TOTP to access this page</h2>
                <Button asChild>
                    <a href="/totp-setup">Go to TOTP Setup</a>
                </Button>
            </div>
        );
    }

    if (!verified) {
        return (
            <>
            <Navbar/>
                <div className="max-w-sm mx-auto mt-10 space-y-4 text-center">
                    <h2 className="text-lg font-semibold">Enter your TOTP code</h2>
                    <Input
                        placeholder="6-digit code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="text-center"
                    />
                    <Button onClick={handleVerify} disabled={loading} className="w-full">
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </div>
            </>
        );
    }

    return <>{children}</>;
};

export default TOTPGuard;
