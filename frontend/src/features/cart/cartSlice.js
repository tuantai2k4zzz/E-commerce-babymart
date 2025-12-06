import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [], subtotal: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload.items || [];
      state.subtotal = action.payload.subtotal || 0;
    },
    resetCart(state) {
      state.items = [];
      state.subtotal = 0;
    }
  }
});

export const { setCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
