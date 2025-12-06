import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("bm_auth");
const initialState = saved ? JSON.parse(saved) : { user: null, token: "" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("bm_auth", JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("bm_auth");
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
