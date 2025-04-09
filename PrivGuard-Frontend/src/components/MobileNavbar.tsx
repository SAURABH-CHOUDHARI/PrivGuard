// src/components/MobileNavbar.tsx

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileNavbar() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-background text-foreground p-6">
                    <nav className="space-y-4">
                        <Link to="/" className="block text-lg font-semibold hover:underline">
                            Home
                        </Link>
                        <Link to="/vault" className="block text-lg font-semibold hover:underline">
                            Vault
                        </Link>
                        <Link to="/add-website" className="block text-lg font-semibold hover:underline">
                            Add Website
                        </Link>
                        <Link to="/check-breaches" className="block text-lg font-semibold hover:underline">
                            Check Breaches
                        </Link>
                        <Link to="/auth" className="block text-lg font-semibold hover:underline">
                            Sign In
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
