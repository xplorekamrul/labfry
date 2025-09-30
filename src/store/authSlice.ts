import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type User = { id: string; firstName?: string; lastName?: string; email: string; role: string; emailVerified: boolean };
type State = { user: User | null; wsToken?: string | null };
const initial: State = { user: null, wsToken: null };

const slice = createSlice({
  name: "auth", initialState: initial, reducers: {
    setUser(state, a: PayloadAction<User | null>) { state.user = a.payload; },
    setWsToken(state, a: PayloadAction<string | null>) { state.wsToken = a.payload; },
  }
});
export const { setUser, setWsToken } = slice.actions;
export default slice.reducer;
