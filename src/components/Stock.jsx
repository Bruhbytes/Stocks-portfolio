const Stock = (props) => {
    return(
        <div style={{
            backgroundColor: "#1F2A40",
            height: "80px",
            borderRadius:"10px",
            paddingLeft:"2rem",
            paddingRight:"2rem",
            margin:"1rem 0.5rem"
        }}>
            <h1 style={{color:"#4cceac", marginBottom:"0"}}>{props.name}</h1>
            <p style={{color:"#4cceac", fontSize:"1.2rem", marginTop:"0"}}>{props.symbol} : {props.exchange} ({props.country})</p>            
        </div>
    )
}
export default Stock;