// searchSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchPanNumber = createAsyncThunk(
    'search/searchPanNumber',
    async ({ number }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(
                'https://staging.rdnidhi.com/result_search',
                {
                    number,
                    share: ''
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        result: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchPanNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPanNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(searchPanNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default searchSlice.reducer;