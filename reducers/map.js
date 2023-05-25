import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        buddy: null,
        address: null,
        polyline: [],
        waypoints: [],
    },
};

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setBuddy: (state, action) => {
            state.value.buddy = action.payload;
        },
        setPolyline: (state, action) => {
            state.value.polyline = action.payload;
        },
        setWaypoints: (state, action) => {
            state.value.waypoints = action.payload;
        },
        setAddress: (state, action) => {
            state.value.address = action.payload;
        }
    },
});

export const { setBuddy, setAddress, setPolyline, setWaypoints } = mapSlice.actions;
export default mapSlice.reducer;
