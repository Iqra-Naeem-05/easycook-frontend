import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Register from "../pages/Register"
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import ChefProfile from "../pages/ChefProfile";
import AddEditDish from "../pages/AddEditDish";
import ChefDishes from "../pages/ChefDishes";
import {RestrictedRoute,PrivateRoute} from "../access/RouteAccess"
import ChefsList from "../pages/ChefsList";
import MyBookings from "../pages/MyBookings";
import ChefUpcomingBookings from "../pages/ChefUpcomingBookings";
import ChangePassword from "../pages/ChangePassword"

const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes with Navbar */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/chefs" element={<MainLayout><ChefsList /></MainLayout>} />

      <Route path="/chef-profile"  element={ <PrivateRoute allowedRoles={["chef"]}> <MainLayout><ChefProfile /></MainLayout> </PrivateRoute> } />
      <Route path="/add-dish"  element={ <PrivateRoute allowedRoles={["chef"]}> <MainLayout><AddEditDish /></MainLayout> </PrivateRoute> } />
      <Route path="/edit-dish/:dishId"  element={ <PrivateRoute allowedRoles={["chef"]}> <MainLayout><AddEditDish /></MainLayout> </PrivateRoute> } />

      <Route path="/chef-dishes/:chefId" element={<MainLayout><ChefDishes /></MainLayout>} />

      <Route path="/my-bookings"  element={ <PrivateRoute allowedRoles={["customer", "chef"]}> <MainLayout><MyBookings /></MainLayout> </PrivateRoute> } />
      <Route path="/chef-upcoming-bookings"  element={ <PrivateRoute allowedRoles={["chef"]}> <MainLayout><ChefUpcomingBookings /></MainLayout> </PrivateRoute> } />
      <Route path="/change-password"  element={ <PrivateRoute allowedRoles={["customer", "chef"]}> <MainLayout><ChangePassword /></MainLayout> </PrivateRoute> } />

      {/* Routes without Navbar */}
      <Route path="/register" element={ <RestrictedRoute><AuthLayout><Register /></AuthLayout></RestrictedRoute>} />
      <Route path="/login" element={ <RestrictedRoute><AuthLayout><Login /></AuthLayout></RestrictedRoute>} />
      <Route path="/logout" element={<Logout />} />


    </Routes>
  );
};

export default AppRoutes;
