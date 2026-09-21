import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import CreateRFQ from "./pages/buyer/CreateRFQ";
import MyRFQs from "./pages/buyer/MyRFQs";
import Quotations from "./pages/buyer/Quotations";

import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import RFQDetails from "./pages/supplier/RFQDetails";
import MyQuotations from "./pages/supplier/MyQuotations";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Buyer */}

          <Route
            path="/buyer"
            element={
              <ProtectedRoute role="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/rfqs"
            element={
              <ProtectedRoute role="buyer">
                <MyRFQs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/rfqs/create"
            element={
              <ProtectedRoute role="buyer">
                <CreateRFQ />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/rfqs/:id/quotations"
            element={
              <ProtectedRoute role="buyer">
                <Quotations />
              </ProtectedRoute>
            }
          />

          {/* Supplier */}

          <Route
            path="/supplier"
            element={
              <ProtectedRoute role="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supplier/rfqs/:id"
            element={
              <ProtectedRoute role="supplier">
                <RFQDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supplier/quotations"
            element={
              <ProtectedRoute role="supplier">
                <MyQuotations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;