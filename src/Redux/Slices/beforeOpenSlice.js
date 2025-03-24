import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchBeforeOpenData = createAsyncThunk(
    'beforeOpen/fetch',
    async ({ market, id, filterDate }, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/beforopenload?market=${market}&agentid=${id}&filterDate=${filterDate}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response fetchBeforeOpenData", response.data)
        return response.data;
    }
);

const beforeOpenSlice = createSlice({
    name: 'beforeOpen',
    initialState: {
        beforeOpenData: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBeforeOpenData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBeforeOpenData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.beforeOpenData = action.payload;
            })
            .addCase(fetchBeforeOpenData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default beforeOpenSlice.reducer;