import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMarketData = createAsyncThunk(
    'market/fetchMarketData',
    async ({ agent_id, market, date }) => {
        const response = await axios.get(
            `https://staging.rdnidhi.com/entery-fetch-newcards?agent_id=${agent_id}&market=${market}&date=${date}`
        );
        console.log("Reponse comming from slice")
        return response.data; // Assuming response is JSON
    }
);

const marketSlice = createSlice({
    name: 'market',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {}, // You can add more reducers if needed
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMarketData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchMarketData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default marketSlice.reducer;
