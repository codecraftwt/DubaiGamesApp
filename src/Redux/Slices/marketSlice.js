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

export const deleteEntryData = createAsyncThunk(
    'market/deleteEntryData',
    async (id, { getState, dispatch }) => {
        try {
            console.log("id deleteEntryData", id)
            const { token } = getState().auth;
            const response = await axios.delete(
                `${API_BASE_URL}/filter-delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("DEleted api Done", response.data)

            return response.data;
        } catch (error) {
            console.error("Error deleting market data", error);
            throw error;
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
            })
            .addCase(deleteEntryData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEntryData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Here, you can handle additional logic if needed after delete
                // The data will be automatically refreshed via dispatching fetchMarketData
            })
            .addCase(deleteEntryData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default marketSlice.reducer;
