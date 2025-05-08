// features/dailyResultSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchDailyResult = createAsyncThunk(
    'dailyResult/fetch',
    async ({ agentName, market, date, agentId }, { getState }) => {
        const { token } = getState().auth;
        console.log(agentName, market, date, agentId)
        const response = await axios.post(`${API_BASE_URL}/daily`,
            {
                market: market,
                date: date
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        );
        console.log("fetchDailyResult===>", response.data)
        return response.data;
    }
);

const dailyResultSlice = createSlice({
    name: 'dailyResult',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailyResult.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDailyResult.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchDailyResult.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default dailyResultSlice.reducer;