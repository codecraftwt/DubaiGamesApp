import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchAfterOpenData = createAsyncThunk(
    'afterOpen/fetch',
    async ({ market, id, filterDate }, { getState }) => {
        const { token } = getState().auth;
        console.log("parames fetchAfterOpenData", market, id, filterDate)
        const response = await axios.get(`${API_BASE_URL}/afteropenload?market=${market}&agentid=${id}&filterDate=${filterDate}`, {

            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response fetchAfterOpenData", response.data)
        return response.data;
    }
);

const afterOpenSlice = createSlice({
    name: 'afterOpen',
    initialState: {
        afterOpenData: null,
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
                state.afterOpenData = action.payload;
            })
            .addCase(fetchAfterOpenData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default afterOpenSlice.reducer;