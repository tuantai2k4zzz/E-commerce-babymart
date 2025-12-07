import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";

// API get products + filters + sort + pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/products", { params });
      return res.data; // Có thể là array HOẶC object { products, total, page, pages }
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,

    // filters
    category: "",
    sort: "createdAt",
    order: "desc",
    priceMin: 0,
    priceMax: 5000000,
    rating: 0,

    // pagination
    page: 1,
    limit: 12,
    pages: 1,
    total: 0,
  },

  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1; // đổi filter thì quay về page 1
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
      state.page = 1;
    },
    setPriceMin: (state, action) => {
      state.priceMin = action.payload;
      state.page = 1;
    },
    setPriceMax: (state, action) => {
      state.priceMax = action.payload;
      state.page = 1;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        // Trường hợp backend trả array thuần: res.json(products)
        if (Array.isArray(payload)) {
          state.products = payload;
          state.total = payload.length;
          state.pages = 1;
          state.page = 1;
          return;
        }

        // Trường hợp backend trả object: { products, total, page, pages }
        if (payload && typeof payload === "object") {
          state.products = payload.products || [];
          state.total =
            typeof payload.total === "number"
              ? payload.total
              : (payload.products?.length ?? 0);
          state.pages = payload.pages || 1;
          if (payload.page) {
            state.page = payload.page;
          }
          return;
        }

        // Fallback
        state.products = [];
        state.total = 0;
        state.pages = 1;
        state.page = 1;
      })

      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.products = [];
      });
  },
});

export const {
    setCategory,
    setSort,
    setOrder,
    setPriceMin,
    setPriceMax,
    setRating,
    setPage,
} = productSlice.actions;

export default productSlice.reducer;
