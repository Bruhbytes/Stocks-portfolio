import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { setMoney, setInvestment } from "../../features/moneySlice";
import { useDispatch, useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [stocks, setStocks] = useState([]);
  const [list, setList] = useState("");
  const { name } = useParams();
  const [Detailed, setDetailed] = useState([]);
  const [idCtr, setIdctr] = useState(0);
  const [allocation, setAllocation] = useState(0);
  const [strategy, setStrategy] = useState(null);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const money = useSelector((state) => state.money.money);
  const investment = useSelector((state) => state.money.investment);
  const pname = useSelector(state => state.money.activePortfolio);

  const navigate = useNavigate();
  useEffect(() => {
    fetchStocks();
    // getStrategy();
  }, []);

  // Define a custom column for the button
  const buttonColumn = {
    field: "action",
    headerName: "Action",
    sortable: false,
    width: 150,
    disableClickEventBubbling: true,
    renderCell: (params) => {
      const handleClick = () => {
        const rowData = params.row;
        console.log("Row data:", rowData.symbol);
        navigate('/metrics', { state: { symbol: rowData.symbol } });
      };

      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClick}
        >
          Action
        </Button>
      );
    },
  };

  // useEffect(() => {
  //   if (stocks && stocks.length > 0) {

  //     setTimeout(fetchDetailedStocks, 3000);
  //   }
  // }, [stocks, setStocks])

  function fetchStocks() {
    axios.get(`http://localhost:4000/api/stocks/${name}`)
      .then(response => {
        console.log(response.data.result);
        if (response.status === 200)
          setStocks(response.data.result);
      })
      .catch(err => console.log(err));
  }

  // function getStrategy(){
  //   axios.get('http://localhost:5000/strategy1')
  //   .then(response => {
  //     console.log(response.data);
  //     setStrategy(response.data);
  //   })
  //   .catch(err => console.log(err));
  // }

  const handleGiveAllocation = async () => {
    try {
      const strategy1Response = await axios.get(
        "http://localhost:5000/strategy1"
      );
      const top3Sectors = strategy1Response.data;
      console.log("top3Sectors:", top3Sectors);

      // Check the structure of top3Sectors
      if (typeof top3Sectors !== "object" || top3Sectors === null) {
        throw new Error("Unexpected data structure from strategy1");
      }

      // Convert top3Sectors to an array if it's an object
      const sectorsArray = Object.keys(top3Sectors);

      const stocksData = await Promise.all(
        sectorsArray.map(async (stock) => {
          
          const options = {
            method: "GET",
            url: `https://yahoo-finance127.p.rapidapi.com/price/${stock}`,
            headers: {
              "X-RapidAPI-Key":
                "cd416fdb02msh70678a6e82930d9p14a1b0jsn079d4472b485",
              "x-rapidapi-host": "yahoo-finance127.p.rapidapi.com",
            },
          };

          const maxRetries = 3;
          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              const response = await axios.request(options);
              console.log(response.data);
              const da = {
                symbol: response.data.symbol,
                last: response.data.regularMarketPrice.raw,
              };
              return { 
                symbol: da.symbol, 
                buyingPrice: da.last,
                country: response.data.region,
                exchange: response.data.fullExchangeName, 
              };
            } catch (error) {
              if (error.response && error.response.status === 429) {
                // Handle rate limit (429) with exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`Rate limit hit, retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
              } else if (error.response && error.response.status === 403) {
                console.error("Authorization error:", error.message);
                throw new Error(
                  "Authorization error, check your API key and permissions"
                );
              } else {
                console.error("Error fetching stock data:", error);
                break; // Exit the loop on other errors
              }
            }
          }
          return null; // Return null for failed requests
        })
      );

      // Filter out any null values from failed requests
      const validStocksData = stocksData;

      console.log("Valid stocks data:", validStocksData);

      if (validStocksData.length === 0) {
        throw new Error("No valid stock data available");
      }
     
      const response = await axios.post("/api/invest", {
        name: pname,
        allocation: allocation,
        stocksData: validStocksData,
      });

      console.log("Investment response:", response.data);
      dispatch(setMoney(money -  response.data.invested_amount))
      dispatch(setInvestment(investment + response.data.invested_amount));
      fetchData(response.data.new_stocks);
    } catch (error) {
      console.error("Error in handleGiveAllocation:", error);      
    }
  };

  const fetchData = async (stocks) => {
    const newDetailed = [];
    for (const stock of stocks) {
      const options = {
        method: 'GET',
        url: 'https://cnbc.p.rapidapi.com/symbols/get-summary',
        params: {
          issueIds: `${stock.issueId}`
        },
        headers: {
          'X-RapidAPI-Key': '2abc076573msh842064a611d99bfp1579c6jsn755dbe9509d7',
          'X-RapidAPI-Host': 'cnbc.p.rapidapi.com'
        }
      };

      const options2 = {
        method: 'GET',
        url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
        params: {
          symbol: `${stock.symbol}`,
          language: 'en'
        },
        headers: {
          'x-rapidapi-key': '2abc076573msh842064a611d99bfp1579c6jsn755dbe9509d7',
          'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
        }
      };

      try {
        let object;
        if(stock.issueId){
          const response = await axios.request(options);
          console.log("final", response.data.ITVQuoteResult.ITVQuote);
          object = {
            id: `${stock._id}`,
            symbol: response.data.ITVQuoteResult.ITVQuote.symbol,
            last: response.data.ITVQuoteResult.ITVQuote.last,
            high: response.data.ITVQuoteResult.ITVQuote.high,
            low: response.data.ITVQuoteResult.ITVQuote.low,
            'chg%': response.data.ITVQuoteResult.ITVQuote.change,
            volume: response.data.ITVQuoteResult.ITVQuote.volume,
            exchange: response.data.ITVQuoteResult.ITVQuote.exchange,
            open: response.data.ITVQuoteResult.ITVQuote.open,
            currency: response.data.ITVQuoteResult.ITVQuote.currencyCode
          };          
        }
        else{
          const response = await axios.request(options2);
          
          object = {
            id: stock._id === null ? `${uuidv4()}` : `${stock._id}`,
            symbol:`${stock.symbol}`,
            last: response.data.data.price,
            high: response.data.data.high,
            low: response.data.data.low,
            'chg%': response.data.data.change_percent,
            volume: response.data.data.volume,
            exchange: `${stock.exchange}`,
            open: response.data.data.open,
            currency: stock.country === 'US' ? "USD" : "INR",
          }          
        }
        newDetailed.push(object);
        setIdctr(idCtr + 1);
      } catch (error) {
        console.error(error);
      }      
    }
    setDetailed(prevDetailed => [...prevDetailed, ...newDetailed]);
  };
  useEffect(() => {
    if (stocks) {
      //Uncomment this to activate the fetch function to rapid api
      // fetchData(stocks);      
    }
  }, [stocks]);




  const columns = [
    { field: "id", headerName: "ID" },
    { field: "symbol", headerName: "Symbol", cellClassName: "name-column--cell" },
    {
      field: "last",
      headerName: "Last Price",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "high",
      headerName: "High",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "low",
      headerName: "Low",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "chg%",
      headerName: "Change%",
      flex: 1,
    },
    {
      field: "volume",
      headerName: "Volume",
      type: "number",
      align: "left",
      flex: 1,
    },
    {
      field: "exchange",
      headerName: "Exchange",
      flex: 1,
    },
    {
      field: "open",
      headerName: "Open",
      flex: 1,
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title={name}
        subtitle="List of Stocks you selected"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={Detailed}
          columns={[...columns, buttonColumn]}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />

        
        <Button sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "15px",
          fontWeight: "bold",
          padding: "5px 10px",
          margin: "1rem",
          display: "inline",
          // position:"absolute",
          // right:"20px",
          zIndex: "10",
          // top:"10px"
        }}
          onClick={() => {
            setShow(true);
            if(allocation === 0){
              window.alert("Please provide valid allocation");
            }
            else handleGiveAllocation();
          }}
        >Get stocks using Strategy 1</Button>

        <input value={allocation} name="allocation" onChange={(e) => setAllocation(e.target.value)}></input>

        {/* <Button sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "15px",
          fontWeight: "bold",
          padding: "5px 10px",
          margin: "1rem",
          display: "inline",
          zIndex: "10",
        }}
        >Get Stocks using Strategy 2</Button>         */}
        
        {/* <input></input> */}

      </Box>
    </Box>
  );
};

export default Contacts;
