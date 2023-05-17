import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        safePlaces: [],
        safePlacesLoading: false,
        alerts: [],
        alertsLoading: false,
        buddies: [],
        buddiesLoading: false,
    },
};

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setSafePlaces: (state, action) => {
            state.value.safePlaces = action.payload.safePlaces;
        },
        setSafePlacesLoading: (state, action) => {
            state.value.safePlacesLoading ? false : true;
        },
        setAlerts: (state, action) => {
            state.value.alerts = action.payload.alerts;
        },
        setAlertsLoading: (state, action) => {
            state.value.alertsLoading ? false : true;
        },
        setBuddies: (state, action) => {
            state.value.buddies = action.payload.buddies;
        },
        setBuddiesLoading: (state, action) => {
            state.value.buddiesLoading ? false : true;
        },
        addAlert: (state, action) => {
            state.value.alerts.push(action.payload.alert);
        },
        logout: (state) => {
            state.value.safePlaces = [];
            state.value.safePlacesLoading = false;
            state.value.alerts = [];
            state.value.alertsLoading = false;
            state.value.buddies = [];
            state.value.buddiesLoading = false;
            state.value.search = '';
        }
    }
});

export const { setSafePlaces, setAlerts, setBuddies, addAlert, logout } = mapSlice.actions;
export default mapSlice.reducer;