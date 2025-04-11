import PasswordBreachCheck from "@/components/PasswordBreachCheck";
import Navbar from "@/components/Navbar";

const CheckPassword = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="max-w-xl w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        🔐 Check if your password is safe
                    </h1>
                    <PasswordBreachCheck />
                </div>
            </div>
        </>
    );
};

export default CheckPassword;
