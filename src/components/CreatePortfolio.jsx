import "../pages/common.css";
import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CreatePortfolio = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [currency, setCurrency] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        // Simulate user login status with localStorage
        // const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (localStorage.getItem("portauth")) {
          setIsLoggedIn(true);
        } else {
          navigate("/login");
        }
        // If user is logged in, fetch their portfolios
        if (isLoggedIn) {
          fetchPortfolios();
        }
      }, []);
    
      const fetchPortfolios = () => {
        // Simulated portfolios data
        const userPortfolios = [
          { id: 1, name: "Portfolio 1", currency: "USD" },
          { id: 2, name: "Portfolio 2", currency: "EUR" },
          // Add more portfolios as needed
        ];
        setPortfolios(userPortfolios);
      };
    
      const createPortfolio = () => {
        // Function to create a new portfolio
        // This could be implemented to send a request to the backend to create a new portfolio
        // const newPortfolio = {
        //   id: Math.random().toString(36).substring(7), // Generate a random ID
        //   name: portfolioName,
        //   currency,
        // };
        // const updatedPortfolios = [...portfolios, newPortfolio]; // Add the new portfolio to the list
        // setPortfolios(updatedPortfolios);
        // setShowModal(false);
        // setPortfolioName("");
        // setCurrency("");

      };

  return (
    <div className="dashboard">
        {isLoggedIn && portfolios.length > 0 ? (
          <>
            <h1>Welcome to Your Dashboard</h1>
            <ul>
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="portfolio-card">
                  <h3>{portfolio.name}</h3>
                  <p>Currency: {portfolio.currency}</p>
                  {/* Additional details can be added here */}
                </div>
              ))}
            </ul>
            <button
              className="create-portfolio-btn"
              onClick={() => setShowModal(true)}
            >
              Create Portfolio
            </button>
          </>
        ) : isLoggedIn ? (
          <>
            <h1>Welcome</h1>
            <button
              className="create-portfolio-btn"
              onClick={() => setShowModal(true)}
            >
              Create Portfolio
            </button>
          </>
        ) : null}

        {/* Modal for Portfolio Creation */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
              <h2 color="black">Create Portfolio</h2>
              <input
                type="text"
                placeholder="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                {/* Add more currency options */}
              </select>
              <button onClick={createPortfolio}>Create</button>
            </div>
          </div>
        )}
      </div>
  )
}

export default CreatePortfolio;