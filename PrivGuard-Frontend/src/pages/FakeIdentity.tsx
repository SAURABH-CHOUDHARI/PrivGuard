// src/pages/FakeIdentity.tsx
import { useEffect, useState } from "react";
import { useFakeUser } from "@/hooks/useFakeUser";
import FakeUserCard from "@/components/fakeIdentity/FakeUserCard";
import TempInboxViewer from "@/components/fakeIdentity/TempInboxViewer";
import Navbar from "@/components/Navbar";
import { createTempAccount } from "@/lib/tempMail";
import { toast } from "sonner";

interface FakeUser {
    name: string;
    email: string;
    username: string;
    password: string;
    avatar: string;
    bio: string;
}

export default function FakeIdentity() {
    const [user] = useState<FakeUser>(useFakeUser());
    const [tempEmail, setTempEmail] = useState<string>("");

    useEffect(() => {
        const setupEmail = async () => {
            try {
                const newEmail = await createTempAccount();
                setTempEmail(newEmail);
            } catch (err) {
                toast.error("Failed to create temporary email");
            }
        };

        setupEmail();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container max-w-lg mx-auto py-12 flex flex-col items-center gap-6">
                <h2 className="text-2xl font-bold text-center">🧪 Fake Identity Generator</h2>
                <FakeUserCard user={{ ...user, email: tempEmail }} />
                <TempInboxViewer email={tempEmail} />
            </div>
        </>
    );
}
