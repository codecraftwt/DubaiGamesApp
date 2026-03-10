import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchWinningRatesData = createAsyncThunk(
    'winningRates/fetch',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const response = await axios.get(`${API_BASE_URL}/winning-rates`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const winningRatesSlice = createSlice({
    name: 'winningRates',
    initialState: {
        winningRatesData: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWinningRatesData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWinningRatesData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.winningRatesData = action.payload;
            })
            .addCase(fetchWinningRatesData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || action.payload || action.error?.message;
            });
    },
});

export default winningRatesSlice.reducer;
