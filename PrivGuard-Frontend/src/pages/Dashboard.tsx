import { JSX } from "react";
import { Link } from "react-router-dom";
import { Shield, PlusCircle, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import Navbar from "../components/Navbar";

export default function Dashboard(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col bg-background transition-colors">
            <Navbar />
            <div className="flex flex-1 items-center justify-center px-6">
                <div className="grid gap-6 text-center">
                    <h1 className="text-4xl font-bold">Privacy Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 flex flex-col items-center gap-3">
                            <Shield size={32} />
                            <Link to="/vault" className="text-lg font-medium">Data Vault</Link>
                        </Card>
                        <Card className="p-6 flex flex-col items-center gap-3">
                            <PlusCircle size={32} />
                            <Link to="/vault/add-password" className="text-lg font-medium">Add Website</Link>
                        </Card>
                        <Card className="p-6 flex flex-col items-center gap-3">
                            <Search size={32} />
                            <Link to="/check-breaches" className="text-lg font-medium">Check Breaches</Link>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
