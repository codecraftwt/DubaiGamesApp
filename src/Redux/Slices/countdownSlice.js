import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

// Async thunk to fetch countdown data
export const fetchCountdowns = createAsyncThunk(
    'countdown/fetchCountdowns',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;

            const response = await axios.get(`${API_BASE_URL}/market`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("fetchCountdowns data", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

const countdownSlice = createSlice({
    name: 'countdown',
    initialState: {
        marketsTime: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountdowns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountdowns.fulfilled, (state, action) => {
                state.loading = false;
                state.marketsTime = action.payload;
            })
            .addCase(fetchCountdowns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default countdownSlice.reducer;
