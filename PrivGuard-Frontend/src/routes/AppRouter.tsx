import PrivateRoute from "@/components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasswordVault from "@/pages/PasswordVault";
import PasswordDetail from "@/pages/PasswordDetail";
import AddPassword from "@/pages/AddPassword";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/sections/HomePage";


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vault" element={<PrivateRoute><PasswordVault /></PrivateRoute>} />
                <Route path="/vault/add-password" element={<PrivateRoute><AddPassword /></PrivateRoute>} />
                <Route path="/password/:id" element={<PasswordDetail />} /> {/* Passkey Protected */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
