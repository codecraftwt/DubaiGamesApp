import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch agents from the API
export const fetchAgents = createAsyncThunk("agents/fetchAgents", async () => {
    const response = await axios.get("https://staging.rdnidhi.com/agents");
    return response.data;
});

// Add a new agent
export const addAgent = createAsyncThunk("agents/addAgent", async (agent) => {
    const response = await axios.post("https://staging.rdnidhi.com/agents", agent);
    return response.data;
});

// Update an agent
export const updateAgent = createAsyncThunk("agents/updateAgent", async (agent) => {
    const response = await axios.put(`https://staging.rdnidhi.com/agents/${agent.id}`, agent);
    return response.data;
});

// Delete an agent
export const deleteAgent = createAsyncThunk("agents/deleteAgent", async (id) => {
    await axios.delete(`https://staging.rdnidhi.com/agents/${id}`);
    return id;
});

const agentSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgents.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAgents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.agents = action.payload;
            })
            .addCase(fetchAgents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addAgent.fulfilled, (state, action) => {
                state.agents.push(action.payload);
            })
            .addCase(updateAgent.fulfilled, (state, action) => {
                const index = state.agents.findIndex((agent) => agent.id === action.payload.id);
                if (index !== -1) {
                    state.agents[index] = action.payload;
                }
            })
            .addCase(deleteAgent.fulfilled, (state, action) => {
                state.agents = state.agents.filter((agent) => agent.id !== action.payload);
            });
    },
});

export default agentSlice.reducer;