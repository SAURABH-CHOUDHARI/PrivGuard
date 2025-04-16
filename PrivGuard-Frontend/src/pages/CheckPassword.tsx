import PasswordBreachCheck from "@/components/CheckPassword/PasswordBreachCheck";
import Navbar from "@/components/Navbar";

const CheckPassword = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex py-12 justify-center px-4">
                <div className="max-w-xl w-full">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        🔐 Check if your password is safe
                    </h1>
                    <PasswordBreachCheck />
                </div>
            </div>
        </div>
    );
};

export default CheckPassword;