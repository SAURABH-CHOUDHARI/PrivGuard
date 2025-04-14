// src/pages/CheckBreaches.tsx
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import EmailSearchForm from "@/components/breach-checker/EmailSearchForm";
import BreachSummary from "@/components/breach-checker/BreachSummary";
import BreachDetailsTabs from "@/components/breach-checker/BreachDetailsTabs";
import NoBreachesFound from "@/components/breach-checker/NoBreachesFound";
import { BreachResponse } from "@/types/breach-types";

export default function CheckBreaches() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [breachData, setBreachData] = useState<BreachResponse | null>(null);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);


    const handleCheck = async () => {
        if (!email) return;

        setHasSearched(true);
        setLoading(true);
        setBreachData(null);
        setError("");

        try {
            const res = await axios.get(`https://api.xposedornot.com/v1/breach-analytics?email=${email}`);
            if (res.data.Error === "Not found") {
                setBreachData(null);
            } else {
                setBreachData(res.data);
            }
        } catch (err) {
            setError("Failed to check breaches. Make sure the email is correct.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    ;

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">🔍 Check Email Breaches</CardTitle>
                        <CardDescription>
                            Check if your email has been exposed in any data breaches
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EmailSearchForm
                            email={email}
                            setEmail={setEmail}
                            onSubmit={handleCheck}
                            loading={loading}
                        />
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                        <p className="flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </p>
                    </div>
                )}

                {!loading && hasSearched && (
                    <>
                        {breachData ? (
                            breachData.ExposedBreaches?.breaches_details?.length > 0 ? (
                                <div className="space-y-6">
                                    <BreachSummary data={breachData} />
                                    <BreachDetailsTabs data={breachData} />
                                </div>
                            ) : (
                                <NoBreachesFound email={email} />
                            )
                        ) : (
                            <NoBreachesFound email={email} />
                        )}
                    </>
                )}


            </div>
        </>
    );
}