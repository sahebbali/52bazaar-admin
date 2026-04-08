import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Example: check token from localStorage
  const isAuthenticated = !!localStorage.getItem("52bazaarToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
