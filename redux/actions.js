import {SET_TRACKED_ZONE, PUSH_THERMAL_RECORDS} from './actionTypes';

export const setTrackedZone = zoneId => ({
    type: SET_TRACKED_ZONE,
    payload: zoneId,
})

export const pushThermalRecords = log => ({
    type: PUSH_THERMAL_RECORDS,
    payload: log,
})