import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import stockSlice from "./slices/stockSlice";
import { stockApi } from "./slices/stockSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    stock: stockSlice,
    [stockApi.reducerPath]: stockApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stockApi.middleware),
});

export default store;
