import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActivePortfolio, setMoney, setInvestment} from "../features/moneySlice";
import axios from "axios";
import { useAuth } from "../context/auth";


const Portfolio = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [auth, setAuth] = useAuth();


    function handleClick(){
        dispatch(setActivePortfolio(props.name));                
        axios.get(`/api/portfolio?portfolio=${props.name}&email=${auth.user}`)
        .then((response) => {
            const object = response.data;            
            dispatch(setMoney(object.cash));
            dispatch(setInvestment(object.investment));
            navigate(`/dashboard`);
        })
        .catch(err => {
            console.log(err);
        })

    }
    return (
        <div style={{
            backgroundColor: "#1F2A40",
            padding: "10px",
            borderRadius: "20px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            color: "#4cceac", /* Text color */
            border:"2px solid gray", /* Transparent border initially */
            transition: " transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease", /* Add transition effect */
            height: "4rem",
            margin:"1.2rem"
        }}
        onClick={handleClick}
        >
            <h2 style={{margin:"0"}}>{props.name}</h2>
            <p style={{margin:"0"}}>Currency: {props.currency}</p>            
        </div>
    )
}
export default Portfolio;