import { Link, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import {
  FiLogOut,
  FiSend,
  FiCreditCard,
  FiList,
  FiPlusCircle,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { isAdmin } from "../utils/auth";

function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hide navbar on auth pages
  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) =>
    location.pathname.startsWith(path);

  const fullName = localStorage.getItem("full_name") || "User";
  const profilePhoto = localStorage.getItem("profilePhoto");
  const firstLetter = fullName.charAt(0).toUpperCase();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand">💱 Currency-Exchange</span>
      </div>

      <div className="nav-links">
        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
        >
          <FiCreditCard /> <span>Dashboard</span>
        </Link>

        <Link
          to="/wallets"
          className={isActive("/wallets") ? "active" : ""}
        >
          <FiCreditCard /> <span>Wallets</span>
        </Link>

        <Link
          to="/topup"
          className={isActive("/topup") ? "active" : ""}
        >
          <FiPlusCircle /> <span>Top-Up</span>
        </Link>

        <Link
          to="/send-money"
          className={isActive("/send-money") ? "active" : ""}
        >
          <FiSend /> <span>Send</span>
        </Link>

        <Link
          to="/transactions"
          className={isActive("/transactions") ? "active" : ""}
        >
          <FiList /> <span>History</span>
        </Link>
      </div>

      <div className="nav-right">
        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-btn" onClick={toggleDropdown}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="nav-avatar"
              />
            ) : (
              <div className="nav-avatar-letter">{firstLetter}</div>
            )}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                <FiUser /> Profile
              </Link>
              {isAdmin() && (
                <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                  <FiShield /> Admin Panel
                </Link>
              )}
              <button onClick={logout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
