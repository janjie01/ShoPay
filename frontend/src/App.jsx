import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/error404";

const ProtectedRoute = ({ element, allowedRoles, ...props }) => {
  const navigate = useNavigate();
  const userRole = "admin"; // Example role, replace it with your actual logic
  const isAuthenticated = !!document.cookie; // Check if the user is authenticated

  // Define routes that don't require authentication
  const publicRoutes = ["/", "/product/:id"];

  // Check if the route is a public route or if the user has the required role to access the route
  const hasAccess =
    publicRoutes.includes(props.path) ||
    (isAuthenticated && allowedRoles.includes(userRole));

  useEffect(() => {
    if (!hasAccess) {
      navigate("/login", { replace: true });
    }
  }, [hasAccess, navigate]);

  return hasAccess ? React.cloneElement(element, props) : null;
};

const AdminRoute = ({ element, ...props }) => {
  return (
    <ProtectedRoute element={element} allowedRoles={["admin"]} {...props} />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<Dashboard />} allowedRoles={["admin"]} />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute element={<Profile />} allowedRoles={["admin"]} />
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute element={<Cart />} allowedRoles={["admin"]} />
          }
        />
        <Route
          path="/forbiddenpage"
          element={<AdminRoute element={<AdminPage />} />}
        />

        {/* Add the catch-all route for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
