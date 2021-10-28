import {SET_TRACKED_ZONE, PUSH_THERMAL_RECORDS} from '../actionTypes';

const initialState = {
    trackedZone : '',
    thermalRecords : [],
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TRACKED_ZONE :
            return {
                ...state,
                trackedZone : action.payload,
            };
        case PUSH_THERMAL_RECORDS :
            if (!Array.isArray(action.payload)) { // single record
                let logs = state.thermalRecords.slice( state.thermalRecords.length >= 100 ? 1 : 0 );
                logs.push (action.payload);
                return {
                    ...state,
                    thermalRecords : logs,
                }
            }
            else { // array of records
                if (action.payload.length > 100) {
                    action.payload.splice(100);
                }
                let logs = state.thermalRecords.slice( (state.thermalRecords.length + action.payload.length) >= 100 ?
                                                        (state.thermalRecords.length + action.payload.length - 100) : 0 );
                logs = [...logs, ...action.payload];
                return {
                    ...state,
                    thermalRecords : logs,
                }
            }
        default :
            return state;
    }
}

export default reducer;