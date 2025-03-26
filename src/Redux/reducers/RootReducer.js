import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import marketReducer from '../Slices/marketSlice'
import AgentReducer from '../Slices/agentSlice';
import EntryReducer from '../Slices/entrySlice'
import autoCompleteReducer from "../Slices/autoCompleteSlice"
import dailyResultReducer from "../Slices/dailyResultSlice"
import beforeOpenReducer from "../Slices/beforeOpenSlice"
import afterOpenReducer from "../Slices/afterOpenSlice"
import staffListReducer from "../Slices/staffSlice"
import panNumberReducer from "../Slices/panNumberSlice"

// import galleryReducer from '../Slices/gallerySlice';
// import webSocketReducer from '../Slices/webSocketSlice';
// import websiteReducer from '../Slices/websiteSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    market: marketReducer,
    agents: AgentReducer,
    entry: EntryReducer,
    autoComplete: autoCompleteReducer,
    dailyResult: dailyResultReducer,
    beforeOpen: beforeOpenReducer,
    afterOpen: afterOpenReducer,
    staff: staffListReducer,
    panNumbers: panNumberReducer
    // gallery: galleryReducer,
    // webSocket: webSocketReducer,
    // webSite: websiteReducer,
});

export default rootReducer;
