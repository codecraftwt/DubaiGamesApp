import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitEntry = createAsyncThunk(
    'entry/submitEntry',
    async (payload, { rejectWithValue }) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            payload._token = csrfToken;
            console.log("submitEntry api hitting .........")

            const response = await axios.post('https://staging.rdnidhi.com/entery', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Include the CSRF token in the headers
                },
            });
            console.log("submitEntry response", response.data)
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response); // Log the full error response
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