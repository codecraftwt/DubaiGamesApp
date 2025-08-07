import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchFundAccount = createAsyncThunk(
    'fundAccount/fetchFundAccount',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get/fund-account`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.fundAccount || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch fund account');
        }
    }
);

// Thunk to store/update fund account
export const storeFundAccount = createAsyncThunk(
    'fundAccount/storeFundAccount',
    async ({ token, formData }, { rejectWithValue }) => {
        try {
            await axios.post(`${API_BASE_URL}/store/fund-account`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return formData;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update fund account' });
        }
    }
);

const fundAccountSlice = createSlice({
    name: 'fundAccount',
    initialState: {
        data: null,
        loading: false,
        error: null,
        formErrors: {},
    },
    reducers: {
        clearFundAccountErrors: (state) => {
            state.formErrors = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchFundAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFundAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchFundAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = null;
            })

            // Store
            .addCase(storeFundAccount.pending, (state) => {
                state.loading = true;
                state.formErrors = {};
            })
            .addCase(storeFundAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(storeFundAccount.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload;
                if (payload.errors) {
                    state.formErrors = payload.errors;
                } else {
                    state.error = payload.message;
                }
            });
    },
});

export const { clearFundAccountErrors } = fundAccountSlice.actions;
export default fundAccountSlice.reducer;
