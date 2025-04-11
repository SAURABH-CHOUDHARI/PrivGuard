// src/components/Navbar.tsx

import { JSX, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import MobileNavbar from "@/components/MobileNavbar";
import { navLinks } from "@/config/navigation"; 

export default function Navbar(): JSX.Element {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const location = useLocation();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <nav className="flex items-center justify-between p-4 shadow-md bg-background">
            <div className="flex items-center gap-4">
                <MobileNavbar />
                <Link to="/" className="text-xl font-bold">
                    PrivGuard
                </Link>
            </div>

            <div className="hidden md:flex gap-6">
                {navLinks.map(({ name, path, icon: Icon }) => (
                    <Link
                        key={name}
                        to={path}
                        className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${location.pathname === path ? "text-primary" : "text-muted-foreground"
                            }`}
                    >
                        <Icon size={18} />
                        {name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle dark mode"
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <SignedIn>
                    <UserButton afterSignOutUrl="/" appearance={{
                        elements: {
                            userButtonAvatarBox: "h-8 w-8",
                        },
                    }} />
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="default" className="px-4 py-2 text-sm font-medium">
                            Sign In
                        </Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>
    );
}
