
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchPanNumbers = createAsyncThunk(
    'panNumbers/fetchPanNumbers',
    async ({ filterDate }, { getState }) => {
        try {

            const { token } = getState().auth;
            console.log("payload Date--->", filterDate)

            const response = await axios.get(`${API_BASE_URL}/updatenumber?filterDate=${filterDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Response Data--->", response.data)

            return response.data;
        } catch (error) {
            console.error("error Fetching Pan Number", error)
        }

    }
);

export const addResult = createAsyncThunk(
    'results/addResult',
    async ({ pannumber, number, market, type, filterDate }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            console.log("==========>", pannumber, number, market, type, filterDate)
            const response = await axios.post(
                `${API_BASE_URL}/result`,
                {
                    pannumber,
                    number,
                    market,
                    type,
                    filterDate
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("addResult===>", response)
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateResult = createAsyncThunk(
    'panNumbers/updateResult',
    async ({ id, payload }, { getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(
                `${API_BASE_URL}/update/${id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
);

// 🔹 Delete Result
export const deleteResult = createAsyncThunk(
    'panNumbers/deleteResult',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            await axios.delete(`${API_BASE_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const panNumberSlice = createSlice({
    name: 'panNumbers',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPanNumbers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPanNumbers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPanNumbers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addResult.pending, (state) => {
                state.addStatus = 'loading';
                state.error = null;
            })
            .addCase(addResult.fulfilled, (state, action) => {
                state.addStatus = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(addResult.rejected, (state, action) => {
                state.addStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteResult.pending, (state) => {
                state.deleteStatus = 'loading';
            })
            .addCase(deleteResult.fulfilled, (state, action) => {
                state.deleteStatus = 'success';
                // Optionally remove item from state.data if needed
                state.data = state.data.filter(item => item.id !== action.payload.id);
            })
            .addCase(deleteResult.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.error = action.error.message;
            }).addCase(updateResult.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateResult.fulfilled, (state, action) => {
                state.updateStatus = 'success';
                // Optionally update item in state.data if needed
            })
            .addCase(updateResult.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.error.message;
            })
    },
});

export default panNumberSlice.reducer;
