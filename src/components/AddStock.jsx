import axios from "axios";
import { Button, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { setInvestment, setMoney } from "../features/moneySlice";
import { useSelector, useDispatch } from "react-redux";

const AddStock = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [price, setPrice] = useState(0);
    const [count, setCount] = useState(0);
    const [currency, setCurrency] = useState("");
    const dispatch = useDispatch();
    const money = useSelector(state => state.money.money);
    const invest = useSelector(state => state.money.investment);

    const [auth, setAuth] = useAuth();

    const data = {
        name: props.name,
        symbol: props.symbol,
        exchange: props.exchange,
        issueId: props.issueID,
        country: props.country,
        buyingPrice: price,        
        count: count,        
        email: auth.user
    }
    useEffect(() => {    
        console.log(auth);
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        const options = {
            method: 'GET',
            url: `https://yahoo-finance127.p.rapidapi.com/price/${props.symbol}`,
            headers: {
                'x-rapidapi-key': '2abc076573msh842064a611d99bfp1579c6jsn755dbe9509d7',
                'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            setPrice(response.data.regularMarketPrice.raw);
            if(response.data.financialCurrency == "USD") setCurrency("$");
            else setCurrency("INR");
        } catch (error) {
            console.error(error);
        }
    }

    const handlClick = () => {
        props.onClose();
        axios.post(`/api/stocks/${props.portfolioName}`, data, {headers:{"Content-Type":"application/json"}})
        .then((response) => {
            dispatch(setMoney(response.data.portfolio.cash));
            dispatch(setInvestment(response.data.portfolio.investment));
            console.log(response);
        })
        .catch(err => console.log(err));        

    }

    return (
        <div style={{
            backgroundColor: "#1F2A40",
            height: "300px",
            width: "500px",
            borderRadius: "10px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            margin: "1rem 0.5rem",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: "100",
            textAlign: "center",

            border: "4px #4cceac solid",
            boxShadow: "0 0 5px 0px"
        }}>
            {price != 0 && <h3 style={{
                fontSize: "1.5rem",
                color: "#4cceac",
            }}>The current price of the stock is {currency} {price}</h3>}
            <label style={{
                fontSize: "1.5rem",
                color: "#4cceac",
                margin: "1rem 3rem",
                display: "inline-block"
            }}>How many stocks would like to buy: </label>
            <input type="number" style={{
                height: "2rem",
                display: "block",
                margin: "0.5rem auto",
                width: "70%"
            }}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            />

            <Button sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "12px",
                fontWeight: "bold",
                padding: "5px 10px",
                display: "inline",
                zIndex: "10",
            }}
            onClick={handlClick}
            >OK</Button>
        </div>
    );
};
// });

export default AddStock;