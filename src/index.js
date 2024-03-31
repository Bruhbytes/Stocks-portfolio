import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { AuthContextProvider } from "./context/AuthContext";
import { AuthProvider } from "./context/auth";
import { Provider } from "react-redux";
import {store} from "../src/store/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(  
  <AuthProvider>
    <Provider store={store}>
    <BrowserRouter>      
        <App />        
    </BrowserRouter>  
    </Provider>
    </AuthProvider>
);
