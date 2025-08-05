
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

export const fetchStaffList = createAsyncThunk(
    'staff/fetchStaffList',
    async (_, { getState }) => {
        console.log("api calling")

        const { token } = getState().auth;
        const response = await axios.get(`${API_BASE_URL}/user-list`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
);

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staff: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaffList.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload.data;
            })
            .addCase(fetchStaffList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default staffSlice.reducer;