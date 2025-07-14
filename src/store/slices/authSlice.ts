import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
}

const initialState: AuthState = {
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAccessDetails(state) {
      state.accessToken = "";
    },
  },
});

export const { setAccessToken, clearAccessDetails } = authSlice.actions;
export default authSlice.reducer;
