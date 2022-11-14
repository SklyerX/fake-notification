import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "preset",
  initialState: {
    value: "all",
  },
  reducers: {
    changeState: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeState } = counterSlice.actions;

export default counterSlice.reducer;
