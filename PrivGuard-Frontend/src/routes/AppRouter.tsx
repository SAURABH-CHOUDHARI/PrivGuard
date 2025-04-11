import PrivateRoute from "@/components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasswordVault from "@/pages/PasswordVault";
import PasswordDetail from "@/pages/PasswordDetail";
import AddPassword from "@/pages/AddPassword";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/sections/HomePage";
import FakeIdentity from "@/pages/FakeIdentity";
import CheckPassword from "@/pages/CheckPassword";


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vault" element={<PrivateRoute><PasswordVault /></PrivateRoute>} />
                <Route path="/add-website" element={<PrivateRoute><AddPassword /></PrivateRoute>} />
                <Route path="/password/:id" element={<PasswordDetail />} /> {/* Passkey Protected */}
                <Route path="/identity" element={<PrivateRoute><FakeIdentity /></PrivateRoute>} />
                <Route path="/checkpassword" element={<CheckPassword />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
