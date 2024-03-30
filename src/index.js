import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { AuthContextProvider } from "./context/AuthContext";
import { AuthProvider } from "./context/auth";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(  
  <AuthProvider>
    <BrowserRouter>      
        <App />        
    </BrowserRouter>  
    </AuthProvider>
);
