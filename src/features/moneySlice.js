import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    money: '0',
    activePortfolio: '/',
    investment: 0
}


const moneySlice = createSlice({
    name: "money",
    initialState: initialState,
    reducers:{        
        setMoney: (state, action) => {            
            state.money = action.payload;
        },
        setActivePortfolio: (state, action) => {
            state.activePortfolio = action.payload
        },
        setInvestment: (state, action) => {
            state.investment = action.payload;
        }
    }
})

export const {setMoney, setActivePortfolio, setInvestment} = moneySlice.actions;
export default moneySlice.reducer;