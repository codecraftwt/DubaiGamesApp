import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_BASE_URL} from '../../utils/Api';
import Toast from 'react-native-toast-message';

// Async thunk to add money to wallet
export const addToWallet = createAsyncThunk(
  'wallet/addToWallet',
  async ({amount}, {rejectWithValue, getState}) => {
    try {
      const {token} = getState().auth;
      const response = await axios.post(
        `${API_BASE_URL}/wallet_management`,
        {
          transaction_type: 'credit',
          amount: amount.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

// Async thunk to withdraw money from wallet
export const withdrawFromWallet = createAsyncThunk(
  'wallet/withdrawFromWallet',
  async ({amount}, {rejectWithValue, getState}) => {
    try {
      const {token} = getState().auth;
      const response = await axios.post(
        `${API_BASE_URL}/wallet_management`,
        {
          transaction_type: 'debit',
          amount: amount.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

// Async thunk to fetch wallet history
export const getWalletHistory = createAsyncThunk(
  'wallet/getWalletHistory',
  async (_, {rejectWithValue, getState}) => {
    try {
      const {token} = getState().auth;
      const response = await axios.get(`${API_BASE_URL}/wallet-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    history: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setWalletBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearWalletState: state => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: builder => {
    builder
      // Add to wallet
      .addCase(addToWallet.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addToWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.wallet_balance;
        state.success = action.payload.success;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: action.payload.success,
        });
      })
      .addCase(addToWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action.payload || 'Failed to add money to wallet',
        });
      })
      // Withdraw from wallet
      .addCase(withdrawFromWallet.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(withdrawFromWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.wallet_balance;
        state.success = action.payload.success;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: action.payload.success,
        });
      })
      .addCase(withdrawFromWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action.payload || 'Failed to withdraw money from wallet',
        });
      })

      .addCase(getWalletHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.history || []; // fallback if history not returned
        console.log('Action payload successs ------->', action.payload);
      })
      .addCase(getWalletHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('Action payload error ------->', action.payload);
      });
  },
});

export const {setWalletBalance, clearWalletState} = walletSlice.actions;
export default walletSlice.reducer;
