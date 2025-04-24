import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching cart
export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.cart.items;
    } catch (error) {
      return rejectWithValue(
        error.message || "Terjadi kesalahan saat memuat data cart"
      );
    }
  }
);

// Async thunk for adding to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ bookId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.post(
        "http://localhost:3000/api/cart",
        { bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated cart after successful addition
      dispatch(fetchCartItems());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Gagal menambahkan buku ke keranjang"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
    addingToCart: false,
    addError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle addItemToCart
      .addCase(addItemToCart.pending, (state) => {
        state.addingToCart = true;
        state.addError = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.addingToCart = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.addError = action.payload;
      });
  },
});

export default cartSlice.reducer;
