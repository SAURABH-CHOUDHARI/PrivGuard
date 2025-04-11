// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { Shield, PlusCircle, Search, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const navLinks = [
    { name: "Vault", path: "/vault", icon: Shield },
    { name: "Add Website", path: "/add-website", icon: PlusCircle },
    { name: "Check Breaches", path: "/check-breaches", icon: Search },
    { name: "Fake Identity", path: "/identity", icon: User },
    { name: "Password Check", path: "/checkpassword", icon: Lock },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
            <Navbar />
            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <motion.div
                    className="grid gap-10 text-center max-w-5xl w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Welcome to PrivGuard</h1>
                        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                            One place to manage your passwords, identity and privacy security tools.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {navLinks.map(({ name, path, icon: Icon }) => (
                            <motion.div
                                key={name}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 shadow-md flex flex-col items-center justify-center gap-3"
                            >
                                <Icon size={32} className="text-primary" />
                                <Link to={path} className="text-lg font-semibold hover:underline">
                                    {name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
