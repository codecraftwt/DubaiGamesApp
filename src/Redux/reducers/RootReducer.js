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
import saralUltadelReducer from "../Slices/saralUltadelSlice"
import onlineCustomersReducer from "../Slices/onlineCustomersSlice";
import countdownSlice from "../Slices/countdownSlice"
import walletReducer from '../Slices/walletSlice';
import fundAccount from '../Slices/fundAccountSlice'
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
    panNumbers: panNumberReducer,
    saralUltadel: saralUltadelReducer,
    onlineCustomers: onlineCustomersReducer,
    countdown: countdownSlice,
    wallet: walletReducer,
    fundAccount: fundAccount,

    // gallery: galleryReducer,
    // webSocket: webSocketReducer,
    // webSite: websiteReducer,
});

export default rootReducer;
