import { createSlice } from '@reduxjs/toolkit';
import { fakeLoginApi } from '../../api/authApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/Api';


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
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: username,
            password,
            code: "",
        });

        const { user, token } = response.data;

        await AsyncStorage.setItem('authToken', token);

        dispatch(loginSuccess({ user, token }));
    } catch (error) {
        dispatch(loginFailure(error.response ? error.response.data.message : error.message));
    }
};

export const logoutUser = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.token || (await AsyncStorage.getItem('authToken'));

        if (!token) throw new Error('No authentication token found');

        const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Logged out successfully")
        await AsyncStorage.removeItem('authToken');

        dispatch(logout());
    } catch (error) {
        console.log('Logout error:', error.message);
    }
};


export default authSlice.reducer;
