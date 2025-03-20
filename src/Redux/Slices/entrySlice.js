import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const submitEntry = createAsyncThunk(
    'entry/submitEntry',
    async ({ payload, token }, { rejectWithValue }) => {
        try {
            console.log("payload data-->", payload)
            const response = await axios.post(`${API_BASE_URL}/entery/store`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("submitEntry response", response.data)
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response);
            return rejectWithValue(error.response.data);
        }
    }
);
const entrySlice = createSlice({
    name: 'entry',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitEntry.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default entrySlice.reducer;