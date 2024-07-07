import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { setMoney } from "../../features/moneySlice";
import { useSelector } from "react-redux";

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

  const money = useSelector((state) => state.money.money);

  const navigate = useNavigate();
  useEffect(() => {
    fetchStocks();
    getStrategy();
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

  function getStrategy(){
    axios.get('http://localhost:5000/strategy1')
    .then(response => {
      console.log(response.data);
      setStrategy(response.data);
    })
    .catch(err => console.log(err));
  }
  // const options = {
  //   method: 'GET',
  //   url: 'https://cnbc.p.rapidapi.com/symbols/get-summary',
  //   params: {
  //     issueIds: `${list}`
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '7dffc95252mshce349b5aea69b96p1cb258jsn8e50fde1c28d',
  //     'X-RapidAPI-Host': 'cnbc.p.rapidapi.com'
  //   }
  // };

  useEffect(() => {
    if (stocks) {
      const fetchData = async () => {
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

          try {
            const response = await axios.request(options);
            console.log("final", response.data.ITVQuoteResult.ITVQuote);
            const object = {
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
            setIdctr(idCtr + 1);
            setDetailed(prevDetailed => [...prevDetailed, object]);
          } catch (error) {
            console.error(error);
          }
        }
      };
      //Uncomment this to activate the fetch function to rapid api
      fetchData();
    }
  }, [stocks]);


  // async function fetchDetailedStocks(){  
  //   if (!stocks) {      
  //     return; // Return early if stocks is null or undefined
  //   }

  //   stocks.forEach((stock) => {
  //     if (stock.issueId) {
  //       const newlist = list + stock.issueId + ",";
  //       setList(newlist);
  //     }
  //   });
  //   console.log(list);

  //   try {
  //     const response = await axios.request(options);
  //     console.log("final", response.data);
  //     setSemiDetailed(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

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


        <div style={{

        }}>
          {show && strategy && (
            <div>
              <ul>
        {Object.entries(strategy).map(([key, value]) => 
        
        (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
            </div>
          )}
        </div>
        <Button sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "15px",
          fontWeight: "bold",
          padding: "5px 10px",
          margin:"1rem",
          display: "inline",
          // position:"absolute",
          // right:"20px",
          zIndex:"10",
          // top:"10px"
        }}
        onClick={() => {
          setShow(true);
        }}
        >Get stocks using Strategy 1</Button>

        <input value={allocation} name="allocation"></input>
        <Button sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "15px",
          fontWeight: "bold",
          padding: "5px 10px",
          margin:"1rem",
          display: "inline",
          // position:"absolute",
          // right:"20px",
          zIndex:"10",
          // top:"10px"
        }}
        onClick={() => {}}
        >Give Allocation</Button>
      </Box>
    </Box>
  );
};

export default Contacts;
