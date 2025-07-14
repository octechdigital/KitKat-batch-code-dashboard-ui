import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isRefreshed: boolean;
  batchCount: number;
}

const initialState: UserState = {
  isRefreshed: false,
  batchCount: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsRefreshed: (state, action: PayloadAction<boolean>) => {
      state.isRefreshed = action.payload;
    },
    setBatchCount: (state, action: PayloadAction<number>) => {
      state.batchCount = action.payload;
    },
  },
});

export const { setIsRefreshed, setBatchCount } = userSlice.actions;
export default userSlice.reducer;
