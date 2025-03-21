import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchBeforeOpenData = createAsyncThunk(
    'beforeOpen/fetch',
    async ({ market, agentId, filterDate }, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/api/beforopenload`, {
            params: { market, agentid: agentId, filterDate },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

const beforeOpenSlice = createSlice({
    name: 'beforeOpen',
    initialState: {
        data: null,
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
                state.data = action.payload;
            })
            .addCase(fetchBeforeOpenData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default beforeOpenSlice.reducer;