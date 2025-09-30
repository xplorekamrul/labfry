"use client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import presence from "./presenceSlice";

const store = configureStore({ reducer: { auth, presence } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
