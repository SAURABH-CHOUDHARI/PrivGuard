import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface TOTPContextType {
    isTOTPEnabled: boolean | null;
    refreshTOTPStatus: () => void;
}

const TOTPContext = createContext<TOTPContextType | undefined>(undefined);

export const TOTPProvider = ({ children }: { children: React.ReactNode }) => {
    const [isTOTPEnabled, setIsTOTPEnabled] = useState<boolean | null>(null);
    const { getToken } = useAuth();

    const fetchTOTPStatus = async () => {
        try {
            const token = await getToken();
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/check`,
                {
                    headers: { Authorization: token },
                    withCredentials: true,
                }
            );
            setIsTOTPEnabled(res.data.message === "TOTP is present");
        } catch (err) {
            setIsTOTPEnabled(false);
        }
    };

    useEffect(() => {
        fetchTOTPStatus();
    }, []);

    return (
        <TOTPContext.Provider value={{ isTOTPEnabled, refreshTOTPStatus: fetchTOTPStatus }}>
            {children}
        </TOTPContext.Provider>
    );
};

export const useTOTP = () => {
    const context = useContext(TOTPContext);
    if (!context) throw new Error("useTOTP must be used within a TOTPProvider");
    return context;
};
