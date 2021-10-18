import {SET_TRACKED_ZONE, PUSH_THERMAL_LOG} from './actionTypes';

export const setTrackedZone = zoneId => ({
    type: SET_TRACKED_ZONE,
    payload: zoneId,
})

export const pushThermalLog = log => ({
    type: PUSH_THERMAL_LOG,
    payload: log,
})