import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Claims from "./pages/Claims";
import AdminClaims from "./pages/AdminClaims";
import ClaimsList from "./pages/ClaimsList";
import ClaimDetails from "./pages/ClaimDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Success / Cancel without layout */}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        {/* Protected routes with layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/claims" element={<Claims />} />
                  <Route path="/claims-list" element={<ClaimsList />} />
                  <Route path="/claims/:id" element={<ClaimDetails />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route
                    path="/admin-claims"
                    element={
                      <AdminRoute>
                        <AdminClaims />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;