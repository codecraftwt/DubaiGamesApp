// features/dailyResultSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchDailyResult = createAsyncThunk(
    'dailyResult/fetch',
    async ({ agentName, market, date, agentId }, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/dailyresult?agent_name=${agentName}&filtermarket=${market}&market_date=${date}&agentid=${agentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

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