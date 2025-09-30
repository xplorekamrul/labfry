import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "presence", initialState: { online: false },
  reducers: { setOnline(state, a: PayloadAction<boolean>) { state.online = a.payload; } }
});
export const { setOnline } = slice.actions;
export default slice.reducer;
