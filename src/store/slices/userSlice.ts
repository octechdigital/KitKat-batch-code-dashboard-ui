import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserReducerStore {
  name: string;
  email: string;
  isRefreshed: boolean;
  isHeaderRefresh: boolean;
}

const initialState: UserReducerStore = {
  name: "",
  email: "",
  isRefreshed: false,
  isHeaderRefresh: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<UserReducerStore>) {
      return { ...state, ...action.payload };
    },
    clearUserDetails() {
      return initialState;
    },

    setIsRefreshed(state, action: PayloadAction<boolean>) {
      state.isRefreshed = action.payload;
    },
    setIsHeaderRefreshed(state, action: PayloadAction<boolean>) {
      state.isHeaderRefresh = action.payload;
    },
  },
});

export const {
  setUserDetails,
  clearUserDetails,
  setIsRefreshed,
  setIsHeaderRefreshed,
} = userSlice.actions;

export default userSlice.reducer;
