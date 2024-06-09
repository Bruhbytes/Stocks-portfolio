import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../theme";
import { Button, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMoney, setInvestment } from "../features/moneySlice";


const Stock = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const data = {
        name: props.name,
        symbol: props.symbol,
        exchange: props.exchange,
        issueId: props.issueID,
        country: props.country
    }
    const [allocation, setAllocation] = useState(0);
    const dispatch = useDispatch();
    const money = useSelector((state) => state.money.money);
    const investment = useSelector((state) => state.money.investment);

    function handleClick() {
        axios.post(`http://localhost:4000/api/stocks/${props.portfolioName}`, data, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                console.log(response.data);
            })
            .catch(err => console.log(err));
    }
    return (
        <div style={{
            backgroundColor: "#1F2A40",
            height: "80px",
            borderRadius: "10px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            margin: "1rem 0.5rem",
            position:"relative"
        }}            
        >
            <h1 style={{ color: "#4cceac", marginBottom: "0", width:"85%" }}>{props.name}</h1>
            <p style={{ color: "#4cceac", fontSize: "1.2rem", marginTop: "0", width:"85%" }}>{props.symbol} : {props.exchange} ({props.country})</p>
            <Button sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "12px",
                fontWeight: "bold",
                padding: "5px 10px",
                display: "inline",
                position:"absolute",
                right:"20px",
                zIndex:"10",
                top:"10px"
            }}
            onClick={handleClick}
            >Add Stock</Button>

            <input type="text" value={allocation} onChange={(e) => {
                setAllocation(e.target.value)                
            }} style={{
                width:"20px",
                position:"absolute",
                top:"50px",
                right:"150px",
                zIndex:"100"
            }}/>
            <Button sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "12px",
                fontWeight: "bold",
                padding: "5px 10px",
                display: "inline",
                position:"absolute",
                right:"20px",
                zIndex:"10",
                top:"50px"
            }}
            onClick={() => {
                var temp = money - (money * allocation/100);
                dispatch(setMoney(temp));
                console.log(money);                
                dispatch(setInvestment(investment - allocation));
            }}
            >Add Allocation</Button>
        </div>
    )
}
export default Stock;