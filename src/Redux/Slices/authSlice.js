import { createSlice } from '@reduxjs/toolkit';
import { fakeLoginApi } from '../../api/authApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/Api';
import Toast from 'react-native-toast-message';


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

export const loginUser = (username, password, code) => async (dispatch) => {
    dispatch(loginStart());
    try {
        console.log("api starting")
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: username,
            password,
            code: code,
        });

        const { user, token } = response.data;
        console.log("Login api", response.data)
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

        dispatch(loginSuccess({ user, token }));
        Toast.show({
            type: 'success',
            text1: response?.data?.message,
        });
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: "Login Failed",
            text2: error.response?.data?.error || "Something went wrong",
        });

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
        Toast.show({
            type: 'success',
            text1: response?.data?.message,
        });
        dispatch(logout());
    } catch (error) {
        console.log('Logout error:', error.message);
    }
};


export default authSlice.reducer;
