import { JSX } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function HomePage(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex flex-1 items-center justify-center px-6 py-24 md:py-36">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl text-center space-y-8"
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Own Your Digital Footprint.
                    </motion.h1>

                    <motion.p
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        PrivGuard helps you track your data, stay secure, and take control of your online presence. Simple, private, and powerful.
                    </motion.p>

                    <motion.div
                        className="flex justify-center gap-4 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Button size="lg">Get Started</Button>
                        <Button variant="outline" size="lg">Learn More</Button>
                    </motion.div>

                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <img
                            src="/hero_vault.svg" // Replace with your asset
                            alt="Privacy Illustration"
                            className="mx-auto max-w-xs md:max-w-md"
                        />
                    </motion.div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
