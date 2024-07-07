import "../pages/common.css";
import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from "../context/auth";
import axios from "axios";
import Portfolio from "./Portfolio";
import { useNavigate } from "react-router-dom";
import { setActivePortfolio } from "../features/moneySlice";
import { useDispatch } from "react-redux";


const CreatePortfolio = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [portfolios, setPortfolios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [currency, setCurrency] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [auth, setAuth] = useAuth();
    const [cardData, setCardData] = useState([]);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if the user is logged in
        // Simulate user login status with localStorage
        // const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (localStorage.getItem("portauth")) {
            setIsLoggedIn(true);
            fetchPortfolios();
            fillerData();
        } else {
            navigate("/login");
        }
        // If user is logged in, fetch their portfolios                
    }, []);


    const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary',
        params: { region: 'IN' },
        headers: {
            'X-RapidAPI-Key': '7dffc95252mshce349b5aea69b96p1cb258jsn8e50fde1c28d',
            'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
    };


    const fillerData = async () => {
        try {
            const response = await axios.request(options);
            console.log(response.data.marketSummaryAndSparkResponse.result);
            setCardData(response.data.marketSummaryAndSparkResponse.result)

        } catch (error) {
            console.error(error);
        }

    }
    const fetchPortfolios = () => {
        axios.get(`http://localhost:4000/api/portfolio?email=${auth.user}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    setPortfolios(response.data);
                }
            })
            .catch(err => console.log(err));
    };

    const createPortfolio = () => {
        // Function to create a new portfolio        
        const newPortfolio = {
            email: auth.user,
            name: portfolioName,
            currency: currency,
            stocks: [],
            cash: 0,
            investment: 0
        };
        axios.post("http://localhost:4000/api/portfolio", newPortfolio, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    dispatch(setActivePortfolio(response.data.message.name));
                    navigate(`/team/${response.data.message.name}`);                    
                }
            })
            .catch(error => console.log(error));

        // const updatedPortfolios = [...portfolios, newPortfolio]; // Add the new portfolio to the list
        // setPortfolios(updatedPortfolios);
        // setShowModal(false);
        // setPortfolioName("");
        // setCurrency("");

    };

    return (
        <div>
            <h1>Welcome to Your Dashboard</h1>
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
                gap: "2rem",
                backgroundColor: "#151632",
                justifyContent: "center"
            }}>
                {cardData.length > 0 && cardData.slice(0, 6).map((card, ind) => {
                    var change = 0;
                    var status = "green"
                    // eslint-disable-next-line no-restricted-globals
                    const arr = card.spark.close;
                    if (arr) {
                        change = (arr[arr.length - 1] - arr[0]) / 100
                    }

                    return (
                        <div key={ind} style={{
                            borderRadius: "10px",
                            backgroundColor: "#024166",
                            height: "100px",
                            flexBasis: "10rem",
                            color: "#4cceac",
                            padding: "10px 15px",
                            margin: "5px",
                        }}>
                            <h2 style={{ margin: "0" }}>{card.shortName}</h2>
                            <p style={{ margin: "0", fontSize: "18px" }}>{card.spark.previousClose}</p>
                            <p style={{ margin: "0", color: change < 0 ? "#f0263a" : "#0afa1e", fontSize: "15px" }}>
                                {change !== 0 && change.toFixed(3)}%
                            </p>
                        </div>
                    )
                })}
            </div>
            <div style={{ textAlign: "center", width: "100%", position: "absolute", bottom: "2rem" }}>
                {portfolios.length > 0 ? (
                    <div style={{
                        width: "80%",
                        margin: "1rem auto"
                    }}>
                        <ul>
                            {portfolios.map((portfolio, ind) => (
                                <Portfolio name={portfolio.name} currency={portfolio.currency} key={ind} />
                            ))}
                        </ul>
                        <button
                            className="create-portfolio-btn"
                            onClick={() => setShowModal(true)}
                        >
                            Create Portfolio
                        </button>
                    </div>
                ) : (
                    <div style={{
                        position: "absolute",
                        bottom: "70px",
                        left: "40%"
                    }}>
                        <h1>Welcome</h1>
                        <button
                            className="create-portfolio-btn"
                            onClick={() => setShowModal(true)}
                        >
                            Create Portfolio
                        </button>
                    </div>
                )}

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
                                <option value="INR">INR</option>
                                {/* Add more currency options */}
                            </select>
                            <button onClick={createPortfolio}>Create</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatePortfolio;