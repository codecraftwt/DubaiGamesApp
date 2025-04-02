import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Api";

export const deleteSaralUltadel = createAsyncThunk(
    'saralUltadel/delete',
    async ({ ids, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/saralUltadel`,
                { id: ids },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const saralUltadelSlice = createSlice({
    name: "saralUltadel",
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSaralUltadelState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteSaralUltadel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteSaralUltadel.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteSaralUltadel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetSaralUltadelState } = saralUltadelSlice.actions;
export default saralUltadelSlice.reducer;