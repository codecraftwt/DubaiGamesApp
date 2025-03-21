import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchAfterOpenData = createAsyncThunk(
    'afterOpen/fetch',
    async ({ market, agentId, filterDate }, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/api/afteropenload`, {
            params: { market, agentid: agentId, filterDate },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

const afterOpenSlice = createSlice({
    name: 'afterOpen',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAfterOpenData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAfterOpenData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAfterOpenData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default afterOpenSlice.reducer;