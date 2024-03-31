import "./common.css";
import React, { useEffect } from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [auth, setAuth] = useAuth();
  
    const navigate = useNavigate();
    const location = useLocation();
    const [type, setType] = useState("password");

    useEffect(()=>{
      if(localStorage.getItem("portauth")){
        navigate("/")
      }
    },[])
    
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post(
          "http://localhost:4000/api/login",
          {
            email,
            password,
          }
        );

        if (response && response.data.success) {
          
          console.log(response.data.token);
  
          localStorage.setItem("portauth", JSON.stringify(response.data.token));
          // navigate("/");
          navigate("/")
        } else {
          
        }
      } catch (err) {
        console.error(err.message);
        toast.error("Something went wrong!!");
      }
        
        
    };
  
    return (
      
        <div className="signup-container">
          <form
            className="signup-form"
            onSubmit={handleSubmit}           
          >
            <h2 className="signup-heading">Login</h2>
  
            <div className="mb-4">
              <label
                htmlFor="email"
                className="signup-label"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="signup-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="password"
                className="signup-label"
              >
                Password
              </label>
              <input
                type={type}
                id="password"
                name="password"
                className="signup-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                required
              />
              <span
                className="flex justify-around items-center cursor-pointer"
                // onClick={handleToggle}
              >
                {/* <Icon className="absolute mr-10" 
                // icon={icon} 
                size={25} /> */}
              </span>
            </div>
  
            <div className="btn_div">
              <button className="signup-btn">Login</button>
            </div>
          </form>
  
          <div className="mt-2">
            <p className="">Don't have an account?</p>
            <Link to="/signup" className="custom-link">
              Create Account
            </Link>
  
           
          </div>
        </div>
      
    );
  };
  
  export default Login;
