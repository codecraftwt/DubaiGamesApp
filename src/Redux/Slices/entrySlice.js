import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';
import Toast from 'react-native-toast-message';
import { getWalletHistory, setWalletBalance } from './walletSlice';
import { Alert } from 'react-native';

export const submitEntry = createAsyncThunk(
    'entry/submitEntry',
    async ({ payload, token }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/entery/store`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("submitEntry response", response.data);

            // If the response includes wallet balance, update it immediately
            if (response.data.wallet_balance !== undefined) {
                dispatch(setWalletBalance(response.data.wallet_balance));
            }

            // If success is false, check for insufficient balance
            if (!response.data.success) {
                if (response.data.message === 'Insufficient wallet balance') {
                    Alert.alert(
                        'Insufficient Balance',
                        'Your wallet balance is too low to place this entry. Please add funds to your wallet.',
                        [
                          
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                        ]
                    );
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: response.data.message || 'Entry submission failed',
                        position: 'top',
                    });
                }
                return rejectWithValue(response.data);
            }

            // If successful, show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: response.data.message || 'Entry submitted successfully',
                position: 'top',
            });

            // Refresh wallet data to ensure everything is up to date
            dispatch(getWalletHistory());

            return response.data;
        } catch (error) {
            console.error('Error details:', error.response);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to submit entry',
                position: 'top',
            });
            return rejectWithValue(error.response?.data);
        }
    }
);

const entrySlice = createSlice({
    name: 'entry',
    initialState: {
        loading: false,
        error: null,
        success: false,
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = '';
            })
            .addCase(submitEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Entry submitted successfully';
            })
            .addCase(submitEntry.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                state.message = action.payload?.message || 'Failed to submit entry';

                // Don't show toast for insufficient balance as we're showing an alert
                if (action.payload?.message !== 'Insufficient wallet balance') {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: state.message,
                        position: 'top',
                        visibilityTime: 3000,
                    });
                }
            });
    },
});

export default entrySlice.reducer;