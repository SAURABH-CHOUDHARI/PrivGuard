import { JSX, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function Navbar(): JSX.Element {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <nav className="flex items-center justify-between p-4 shadow-md bg-background">
            <Link to="/" className="text-xl font-bold">
                PrivGuard
            </Link>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                {/* Show UserButton if signed in, else show SignInButton */}
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </nav>
    );
}
