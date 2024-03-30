import "./common.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmaill] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // setEmail("");
    // setPassword("");

    try {
      const response = await axios.post("http://localhost:4000/api/signup", {
        email,
        password,
      });
      if (response && response.data) {
        if(response.status==201)
          navigate("/login");
        console.log(response.data);
        // setEmail(response.data.email);
        
      } else {
        console.log("error");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong!!");
    }

  };

  return (
    <div className="signup-container">
      <form className="signup-form"   onSubmit={handleSubmit}>
        <h2 className="signup-heading">Register</h2>
        <div className="mb-4">
          <label htmlFor="email" className="signup-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmaill(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="signup-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="12"
            minLength="6"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="signup-btn-div">
          <button className="signup-btn" type="submit">Sign Up</button>
        </div>
      </form>
      <div className="login-link">
        <div className="text-xl text-black mt-2 mb-1">Already have an account?</div>
        <Link to="/login" className="custom-link">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
