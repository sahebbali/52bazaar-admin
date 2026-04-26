import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminWrapper from "./layout/AdminWrapper";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ProductList from "./pages/admin/products/ProductList";
import AddEditProduct from "./pages/admin/products/AddEditProduct";
import ProductDetails from "./pages/admin/products/ProductDetails";
import Orders from "./pages/admin/orders/Orders";
import OrderDetailsPage from "./pages/admin/orders/OrderDetailsPage";
import Inventory from "./pages/admin/inventory/Inventory";
import LowStockAlerts from "./pages/admin/inventory/LowStock";
import Customers from "./pages/admin/customers/Customers";
import CustomerDetailsPage from "./pages/admin/customers/CustomerDetailsPage";
import CustomerFormPage from "./pages/admin/customers/CustomerFormPage";
import PaymentList from "./pages/admin/payments/PaymentList";
import PaymentDetails from "./pages/admin/payments/PaymentDetails";
import RefundManagement from "./pages/admin/payments/RefundManagement";
import ReportsDashboard from "./pages/admin/reports/ReportsDashboard";
import SalesReport from "./pages/admin/reports/SalesReport";
import OrderReport from "./pages/admin/reports/OrderReport";
import ScheduledReports from "./pages/admin/reports/ScheduledReports";
import NotFound from "./pages/admin/not found/NotFound";
import Settings from "./pages/admin/settings/Settings";
import AdminUsers from "./pages/admin/users/AdminUsers";
import AddEditUser from "./pages/admin/users/AddEditUser";
import PrivateRoute from "./routes/PrivateRoute";
import CouponManagement from "./pages/admin/coupon/CouponManagement";

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
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminWrapper />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoryManagement />} />

            {/* 🔥 Product Routes */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddEditProduct />} />
            <Route path="products/edit/:id" element={<AddEditProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            {/* 🔥 Inventory Routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/low-stock" element={<LowStockAlerts />} />

            {/* 🔥 Order Routes */}
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            {/* 🔥 Customer Routes */}
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetailsPage />} />
            <Route path="customers/add" element={<CustomerFormPage />} />
            <Route path="customers/edit/:id" element={<CustomerFormPage />} />
            {/* 🔥 Payment Routes */}
            <Route path="payments" element={<PaymentList />} />
            <Route path="payments/:id" element={<PaymentDetails />} />
            <Route path="payments/:id/refund" element={<RefundManagement />} />

            <Route path="coupons" element={<CouponManagement />} />
            {/* 🔥 Reports Routes */}
            <Route path="reports" element={<ReportsDashboard />}>
              <Route index element={<SalesReport />} />
              <Route path="sales" element={<SalesReport />} />
              <Route path="orders" element={<OrderReport />} />
              <Route path="scheduled" element={<ScheduledReports />} />
            </Route>
            {/* 🔥 User Routes */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/add" element={<AddEditUser />} />
            <Route path="users/edit/:id" element={<AddEditUser />} />
            {/* 🔥 setting Routes */}
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* 404 Not Found Route */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
