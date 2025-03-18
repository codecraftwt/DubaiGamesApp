import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import marketReducer from '../Slices/marketSlice'
import AgentReducer from '../Slices/agentSlice';
// import galleryReducer from '../Slices/gallerySlice';
// import webSocketReducer from '../Slices/webSocketSlice';
// import websiteReducer from '../Slices/websiteSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    market: marketReducer,
    agents: AgentReducer
    // gallery: galleryReducer,
    // webSocket: webSocketReducer,
    // webSite: websiteReducer,
});

export default rootReducer;
