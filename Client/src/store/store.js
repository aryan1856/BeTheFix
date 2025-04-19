import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import locationSlice from "./locationSlice.js"

const rootReducer = combineReducers({
    user: userSlice, 
    location :locationSlice
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: ["persist/PERSIST", "persist/REGISTER"],
            },
        }),
});

export default store;