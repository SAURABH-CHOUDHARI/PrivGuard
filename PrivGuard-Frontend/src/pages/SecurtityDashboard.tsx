// SecurityDashboard.tsx - Main container component
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SecurityHeader from "@/components/security-dashboard/SecurityHeader";
import SecurityTabs from "@/components/security-dashboard/SecurityTabs";

const SecurityDashboard = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Simulate loading state - will be replaced with your API call later
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <Navbar />
            <div className="max-w-3xl mx-auto pt-10 pb-20 px-4">
                <SecurityHeader />
                
                {isLoading ? (
                    <div className="flex justify-center py-10">Loading security information...</div>
                ) : (
                    <>
                        <SecurityTabs />
                    </>
                )}
            </div>
        </div>
    );
};

export default SecurityDashboard;