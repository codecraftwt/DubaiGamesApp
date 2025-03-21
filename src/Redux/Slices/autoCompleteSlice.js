import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchAgentByCode = createAsyncThunk(
    'agent/fetchByCode',
    async (code, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/agent/getByCode/${code}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

export const fetchAgentByName = createAsyncThunk(
    'agent/fetchByName',
    async (name, { getState }) => {
        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/agent/getByName/${name}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

const autoCompleteSlice = createSlice({
    name: 'autoComplete',
    initialState: {
        agentInfo: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentByCode.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAgentByCode.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.agentInfo = action.payload;
            })
            .addCase(fetchAgentByCode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAgentByName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAgentByName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.agentInfo = action.payload;
            })
            .addCase(fetchAgentByName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default autoCompleteSlice.reducer;