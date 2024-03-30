import "./common.css";
import React from "react";
import  { useState } from "react";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Logout = () => {
  const [auth, setAuth] = useAuth();
  
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    // Redirecting the page after logout.
    localStorage.removeItem("portauth");
    toast.success("Logout successfully");
    window.location.href="/login"
  };

  return (
    <div>
      <ul>
        <li>
          <button onClick={handleLogout} to="/login" className="dropdown-item">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Logout;
