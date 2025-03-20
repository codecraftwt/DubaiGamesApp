import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchMarketData = createAsyncThunk(
    'market/fetchMarketData',
    async ({ agent_id, market, date, token }) => {
        try {
            console.log("data inside fetchMarketData22222", `agent_id=${agent_id}&market=${market}&date=${date}`)
            const response = await axios.get(
                `${API_BASE_URL}/entery-fetch-newcards?agent_id=${agent_id}&market=${market}&date=${date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            return response.data;
        } catch (error) {
            console.log("Error", error)
        }

    }
);

const marketSlice = createSlice({
    name: 'market',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
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
