import { configureStore } from "@reduxjs/toolkit";
import moneySlice from "../features/moneySlice";

export const store = configureStore({
  reducer: {
    money: moneySlice
  },
  
});
