import { useFakeUser } from "@/hooks/useFakeUser";
import FakeUserCard from "@/components/fakeIdentity/FakeUserCard";
import TempInboxViewer from "@/components/fakeIdentity/TempInboxViewer";
import Navbar from "@/components/Navbar";

export default function FakeIdentity() {
    const user = useFakeUser();

    return (
        <>
            <Navbar />
            <div className="flex justify-center px-4">
                <div className="w-full max-w-lg py-10 space-y-6 text-center">
                    <h2 className="text-2xl font-bold">🧪 Fake Identity Generator</h2>
                    <FakeUserCard user={user} />
                    <TempInboxViewer email={user.email} />
                </div>
            </div>
        </>
    );
}
