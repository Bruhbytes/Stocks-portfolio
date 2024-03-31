import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    money: '0',
    activePortfolio: '/',
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
        }
    }
})

export const {setMoney, setActivePortfolio} = moneySlice.actions;
export default moneySlice.reducer;