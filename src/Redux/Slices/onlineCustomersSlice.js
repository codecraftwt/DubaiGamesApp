import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';

// Helper function for auth headers
const getAuthHeaders = (getState) => {
    const { token } = getState().auth;
    console.log("Token ---->", token)
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Create new customer
export const createOnlineCustomer = createAsyncThunk(
    'onlineCustomers/createOnlineCustomer',
    async (customerData, { getState }) => {
        const { token } = getState().auth;
        console.log("Customer Data --------->", customerData)

        try {
            const response = await axios.post(
                `${API_BASE_URL}/online_customer/store`,
                customerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response.data", response.data)
            return response.data;
        } catch (error) {
            console.error("Error creating customer", error);
            throw error;
        }
    }
);

// Fetch all customers
export const fetchOnlineCustomers = createAsyncThunk(
    'onlineCustomers/fetchOnlineCustomers',
    async (_, { getState }) => {
        try {
            const { token } = getState().auth;
            console.log("Tooken --------->", token)
            const response = await axios.get(
                `${API_BASE_URL}/online_customer`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Response Data --->", response.data)
            return response.data;
        } catch (error) {
            console.error("Error fetching customers", error);
            throw error;
        }
    }
);
// Fetch single customer
export const fetchOnlineCustomerById = createAsyncThunk(
    'onlineCustomers/fetchOnlineCustomerById',
    async (customerId, { getState }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(
                `${API_BASE_URL}/online_customer/${customerId}/edit`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching customer", error);
            throw error;
        }
    }
);

// Update customer
export const updateOnlineCustomer = createAsyncThunk(
    'onlineCustomers/updateOnlineCustomer',
    async ({ id, customerData }, { getState }) => {
        console.log("Updating User Data ------------>", customerData)
        try {
            const { token } = getState().auth;
            const response = await axios.put(
                `${API_BASE_URL}/online_customer/${id}`,
                customerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating customer", error);
            throw error;
        }
    }
);

// Delete customer
export const deleteOnlineCustomer = createAsyncThunk(
    'onlineCustomers/deleteOnlineCustomer',
    async (customerId, { getState }) => {
        const { token } = getState().auth;
        try {
            await axios.delete(
                `${API_BASE_URL}/online_customer/delete/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return customerId;
        } catch (error) {
            console.error("Error deleting customer", error);
            throw error;
        }
    }
);

const onlineCustomersSlice = createSlice({
    name: 'onlineCustomers',
    initialState: {
        customers: [],
        currentCustomer: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {
        clearCurrentCustomer: (state) => {
            state.currentCustomer = null;
        },
        resetCustomerStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Customer
            .addCase(createOnlineCustomer.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(createOnlineCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers.push(action.payload.online_customer);
            })

            .addCase(createOnlineCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Fetch All Customers
            .addCase(fetchOnlineCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOnlineCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload.online_customer;
            })
            .addCase(fetchOnlineCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Fetch Single Customer
            .addCase(fetchOnlineCustomerById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOnlineCustomerById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("Fetch current user ------->", action.payload)
                state.currentCustomer = action.payload.online_customer
                    ;
            })
            .addCase(fetchOnlineCustomerById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Update Customer
            .addCase(updateOnlineCustomer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOnlineCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.customers.findIndex(
                    customer => customer.id === action.payload.online_customer.id
                );
                if (index !== -1) {
                    state.customers[index] = action.payload.online_customer;
                }
                console.log(action.payload, "<--------- Update the data of customer")
                state.currentCustomer = action.payload.online_customer;
            })
            .addCase(updateOnlineCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Delete Customer
            .addCase(deleteOnlineCustomer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteOnlineCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = state.customers.filter(
                    customer => customer.id !== action.payload
                );
            })
            .addCase(deleteOnlineCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearCurrentCustomer, resetCustomerStatus } = onlineCustomersSlice.actions;
export default onlineCustomersSlice.reducer;