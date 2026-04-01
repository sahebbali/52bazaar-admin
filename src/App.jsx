import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/amdin/DashboardPage";
import AdminWrapper from "./layout/AdminWrapper";
import CategoryManagement from "./pages/amdin/CategoryManagement";
import ProductList from "./pages/amdin/products/ProductList";
import AddEditProduct from "./pages/amdin/products/AddEditProduct";
import ProductDetails from "./pages/amdin/products/ProductDetails";
import Orders from "./pages/amdin/orders/Orders";
import OrderDetailsPage from "./pages/amdin/orders/OrderDetailsPage";

// Dummy components for example

function App() {
  return (
    <div>
      {/* <Navbar /> This stays visible on all pages */}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* ✅ ADMIN ROUTES */}
        <Route path="/admin" element={<AdminWrapper />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<CategoryManagement />} />

          {/* 🔥 Product Routes */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
          <Route path="products/:id" element={<ProductDetails />} />

          {/* 🔥 Order Routes */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
        </Route>
        {/* 404 Not Found Route */}
        <Route
          path="*"
          element={<div className="text-center py-20">Page Not Found</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
