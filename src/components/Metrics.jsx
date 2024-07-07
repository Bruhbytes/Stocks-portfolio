import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const Metrics = () => {
  const [sharpeRatio, setSharpeRatio] = useState(null);
  const [snapshotImage, setSnapshotImage] = useState(null);
  const [ticker, setTicker] = useState("");
  const [cagr, setCagr] = useState(null);
  const [maxDrawdown, setMaxDrawdown] = useState(null);
  const [volatility, setVolatility] = useState({});
  const [vssyp, setVSSYP] = useState(null);

  const location = useLocation();
  const { symbol } = location.state || { symbol: null };

  useEffect(() => {
    console.log("Fetching stock data for symbol:", symbol);
    fetchStockData();
  }, []);

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
  };

  const fetchStockData = () => {
    axios
      .post("http://127.0.0.1:8000/stock", { symbol })
      .then((response) => {
        console.log(response.data.message);
        fetchSnapshotImage();
        fetchSharpeRatio();
        fetchCagr();
        fetchMaxDrawdown();
        fetchVolatility();
        fetchVSSYP();
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  };

  const fetchSnapshotImage = () => {
    axios
      .get("http://127.0.0.1:8000/snapshot", { responseType: "blob" })
      .then((response) => {
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setSnapshotImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  const fetchSharpeRatio = () => {
    axios
      .get("http://127.0.0.1:8000/sharpe")
      .then((response) => {
        setSharpeRatio(response.data.sharpe_ratio);
      })
      .catch((error) => {
        console.error("Error fetching Sharpe ratio:", error);
      });
  };

  const fetchCagr = () => {
    axios
      .get("http://127.0.0.1:8000/cagr")
      .then((response) => {
        setCagr(response.data.cagr);
      })
      .catch((error) => {
        console.error("Error fetching CAGR:", error);
      });
  };

  const fetchMaxDrawdown = () => {
    axios
      .get("http://127.0.0.1:8000/max_drawdown")
      .then((response) => {
        setMaxDrawdown(response.data.max_drawdown);
      })
      .catch((error) => {
        console.error("Error fetching maximum drawdown:", error);
      });
  };

  const fetchVolatility = () => {
    axios
      .get("http://127.0.0.1:8000/volatility")
      .then((response) => {
        setVolatility(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monthly returns:", error);
      });
  };

  const fetchVSSYP = () => {
    axios
      .get("http://127.0.0.1:8000/SYP", { responseType: "blob" })
      .then((response) => {
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setVSSYP(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching monthly returns:", error);
      });
  };

  const boxStyle = {
    border: "2px solid #ccc",
    padding: "10px",
    textAlign: "center",
    width: "170px",
    background: "#1e2a41", // Dark blue background
    color: "white", // White text color
    borderRadius: "5px", // Border radius
    transition: "background-color 0.3s", // Smooth background color transition
    cursor: "pointer", // Change cursor on hover
  };

  return (
    <>
      <style>{`body { margin: 0; }`}</style>
      <div
        style={{
          backgroundColor: "#1e2a41", // Dark blue background for the entire page
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#1e2a41", // Dark blue background for the entire page
          }}
        >
          {/* <h1 style={{ color: "white" }}>Stock Metrics</h1> */}
          <h1 style={{ marginBottom: "10px", padding: "5px" }}>
            Performance Metrics of the Symbol
          </h1>
          {/* <button
            onClick={fetchStockData}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            Fetch Stock Data
          </button> */}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
            backgroundColor: "#151632",
          }}
        >
          {snapshotImage && (
            <div style={{ border: "1px solid #ccc" }}>
              <img
                src={snapshotImage}
                alt="Snapshot"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                }}
              />
            </div>
          )}
          {vssyp && (
            <div style={{ border: "0.5px solid #ccc" }}>
              <img
                src={vssyp}
                alt="Snapshot1"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            margin: "0 auto",
            maxWidth: "1000px",
            height: "125px",
          }}
        >
          {/* Existing code for snapshot image */}
          <div>Sharpe Ratio: {sharpeRatio}</div>
          {/* <div
            style={{
              ...boxStyle,
              background: "#1e2a41",
              color: "white",
              height: "48px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow to highlight the box
            }}
          >
            {sharpeRatio !== null && <div>Sharpe Ratio: {sharpeRatio}</div>}
          </div> */}
          <div>CAGR: {(cagr * 100).toFixed(2)}%</div>
          {/* <div
            style={{
              ...boxStyle,
              background: "#1e2a41",
              color: "white",
              height: "48px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow to highlight the box
            }}
          >
            {cagr !== null && <div>CAGR: {(cagr * 100).toFixed(2)}%</div>} */}
          <div>Maximum Drawdown: {(maxDrawdown * 100).toFixed(2)}%</div>
          {/* </div> */}
          {/* <div
            style={{
              ...boxStyle,
              background: "#1e2a41",
              color: "white",
              height: "48px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow to highlight the box
            }}
          >
            {maxDrawdown !== null && (
              <div>Maximum Drawdown: {(maxDrawdown * 100).toFixed(2)}%</div>
            )}
          </div> */}
          {/* 
          <div
            style={{
              ...boxStyle,
              background: "#1e2a41",
              color: "white",
              height: "48px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow to highlight the box
            }}
          > */}
          {Object.keys(volatility).length > 0 && (
            <div>
              {/* <h3>Monthly Volatility</h3> */}
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {Object.entries(volatility).map(([month, value]) => (
                  <li key={month} style={{ marginBottom: "5px" }}>
                    {month}: {(value * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default Metrics;
