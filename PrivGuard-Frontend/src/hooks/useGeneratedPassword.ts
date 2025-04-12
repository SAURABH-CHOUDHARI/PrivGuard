// src/hooks/useGeneratedPassword.ts
import { useState } from "react";

export default function useGeneratedPassword(): [string, (value: string) => void, () => void] {
    const [password, setPassword] = useState("");

    const generate = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
    };

    return [password, setPassword, generate];
}
