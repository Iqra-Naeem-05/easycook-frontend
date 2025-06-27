import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, user } = useContext(AuthContext);


  if (isLoggedIn === null) return null;

  // ✅ Reusable Links
  const navLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link text-navyBlue" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-navyBlue" to="/chefs">Our Chefs</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-navyBlue" to="/about">About Us</Link>
      </li>
      {isLoggedIn && (


      <li className="nav-item">
        <Link className="nav-link text-navyBlue" to="/my-bookings">My Bookings</Link>
      </li>
      )}
    </>
  );

  // ✅ Reusable Auth Links
  const authLinks = isLoggedIn ? (
    <>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-navyBlue"
          href=""
          id="profileDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Welcome,  {user?.role === "chef" && ("Chef")} {user?.username}
        </a>
        <ul className="dropdown-menu dropdown-menu-end ">
          {user?.role === "chef" && (
            <>
              <li><Link className="dropdown-item text-brown" to="/chef-profile">Profile</Link></li>
              <li><Link className="dropdown-item text-brown" to="/add-dish">Add Dish</Link></li>
              <li><Link className="dropdown-item text-brown" to={`/chef-dishes/${user.id}`}>My Dishes</Link></li>
              <li><Link className="dropdown-item text-brown" to="/chef-upcoming-bookings">Chef Bookings</Link></li>               
              <li><hr className="dropdown-divider" /></li>
            </>
          )}
          <li><Link className="dropdown-item text-brown" to="/change-password">Change Password</Link></li>
          <li><Link className="dropdown-item text-maron" to="/logout">Logout</Link></li>
        </ul>
      </li>
    </>
  ) : (
    <li className="nav-item">
      <Link className="nav-link text-navyBlue" to="/login">Login</Link>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg mx-4 border-bottom border-navyBlue">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center text-navyBlue" to="/">
          <img src="../images/logo1.png" alt="EasyCook Logo" width="50" height="50" className="me-2" />
        </Link>

        {/* Toggler for small screens only */}
        <button
          className="btn d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Large screen navbar */}
        <div className="d-none d-lg-flex w-100 justify-content-between">
          <ul className="navbar-nav">
            {navLinks}
          </ul>
          <ul className="navbar-nav">
            {authLinks}
          </ul>
        </div>

        {/* Offcanvas for small screens */}
        <div
          className="offcanvas offcanvas-end d-lg-none"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          style={{ width: "220px" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav">
              {navLinks}
            </ul>
            <hr />
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-navyBlue">Welcome, {user?.username}</span>
                  </li>
                  {user?.role === "chef" && (
                    <>
                      <li><Link className="nav-link text-navyBlue" to="/chef-profile">Profile</Link></li>
                      <li><Link className="nav-link text-navyBlue" to="/add-dish">Add Dish</Link></li>
                      <li><Link className="nav-link text-navyBlue" to={`/chef-dishes/${user.id}`}>My Dishes</Link></li>
                      <li><Link className="dropdown-item text-brown" to="/chef-upcoming-bookings">Chef Bookings</Link></li>
                    </>
                  )}
                  <li><Link className="dropdown-item text-brown" to="/change-password">Change Password</Link></li>
                  <li><Link className="nav-link text-danger" to="/logout">Logout</Link></li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link text-navyBlue" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
