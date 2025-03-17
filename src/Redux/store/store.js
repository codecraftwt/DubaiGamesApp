import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from '../reducers/RootReducer.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    timeout: null,
    keyPrefix: '',
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'], // Only persist auth state
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer
});
export const persistor = persistStore(store);
export default store;