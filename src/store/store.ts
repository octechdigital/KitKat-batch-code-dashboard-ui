import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";

// Persist configuration
const persistConfig = {
  key: "ag-v3",
  storage,
  whitelist: ["auth", "user"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

//  Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration of the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable checks for non-serializable data
    }),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development mode
});

// Persist the store
export const persistor = persistStore(store);

// Infer `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
