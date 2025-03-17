import { createSlice } from '@reduxjs/toolkit';
import { fakeLoginApi } from '../../api/authApi';


const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const loginUser = (username, password) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await fakeLoginApi(username, password);
        dispatch(loginSuccess(response));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

export default authSlice.reducer;
