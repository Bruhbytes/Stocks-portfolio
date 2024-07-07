import { Box, Button, Typography, useTheme, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from 'axios';
import SearchIcon from "@mui/icons-material/Search";
import Stock from "../../components/Stock";
import { useParams } from "react-router-dom";


const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showStocks, setShowStocks] = useState(false);
  const [stocks, setStocks] = useState([]);
  
  const [stockName, setStockName] = useState("");
  const [data, setData] = useState(null);

  const {name} = useParams();
  
  useEffect(() => {
    //Not in use as of now...This functionality is copied over to MyHoldings section/Contacts->index.jsx page
    // fetchStocks();
  }, [])

  const fetchStocks = () => {
    axios.get(`http://localhost:4000/api/stocks/${name}`)
    .then(response => {
      console.log(response);   
      if(response.status === 200)   
        setStocks(response.data);
    })
    .catch(err => console.log(err));
  }


  const options = {
    method: 'GET',
    url: 'https://cnbc.p.rapidapi.com/v2/auto-complete',
    params: { q: `${stockName}` },
    headers: {
      'X-RapidAPI-Key': '2abc076573msh842064a611d99bfp1579c6jsn755dbe9509d7',
      'X-RapidAPI-Host': 'cnbc.p.rapidapi.com'
    }
  };

  async function handleClick() {
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setData(response.data);
      setStockName("");
    } catch (error) {
      console.error(error);
    }

  }

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                  ? colors.greenAccent[700]
                  : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title={name} subtitle="Managing the Stocks" />
      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Stock Name"
        name="StockName"
        value={stockName}
        sx={{ gridColumn: "span 2" }}
        onChange={(e) => setStockName(e.target.value)}
      style={{width: "95%"}}
      />
      <IconButton type="button" sx={{ p: 1 }} >
        <SearchIcon style={{fontSize: "2rem"}} onClick={handleClick}/>
      </IconButton>
      {data && <div style={{
        backgroundColor: "#141b2d"        
      }}>
        {data.data.symbolEntries.tags[0].results.map((res, ind) => {
          return(
            <Stock 
            country={res.countryCode}
            exchange={res.exchangeName}
            key={ind}
            name={res.name}
            portfolioName={name}
            symbol={res.symbol}
            issueID={res.issueId}
            />
          )
        })}
      </div>}

      
      {showStocks && <Box
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
        }}
      >
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>}
    </Box>
  );
};

export default Team;
