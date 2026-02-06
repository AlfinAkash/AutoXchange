import React, { useContext, useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./login/Login";
import Dashboard from "./pages/components/Dashboard";
import Layout from "./Layout.jsx";
import AuthProvider, { AuthContext } from "./context/Authcontext";
import PurchaseList from "./pages/components/Vehiclepurchse.jsx";
import Soldvehicle from "./pages/components/Soldvehicle.jsx";
import MaintenancePage from "./pages/components/modal/Maintenancepage.js";
import BookLoader from "./pages/components/Loader/BookLoader/BookLoader.js";
import CreateUser from "./admin/CreateUsers/CreateUser.js";
import ForgotPassword from "./forgetPass/ForgetPassword.jsx";
import ResetPassword from "./forgetPass/ResetPassword.js";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
     <Route path="/reset-password" element={<ResetPassword />} />


      {/* Protected routes */}
      {isAuthenticated && (
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="purchase-vehicle" element={<PurchaseList />} />
          <Route path="sold-vehicle" element={<Soldvehicle />} />
          <Route path="service-maintenance" element={<MaintenancePage />} />
          <Route path="create-staff" element={<CreateUser />} />
        </Route>
      )}

      {/* Fallback redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
};


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        {loading ? <BookLoader /> : <AppRoutes />}
      </Router>
    </AuthProvider>
  );
}

export default App;
