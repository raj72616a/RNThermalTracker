import {SET_TRACKED_ZONE, PUSH_THERMAL_LOG} from '../actionTypes';

const initialState = {
    trackedZone : '',
    thermalLogs : [],
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TRACKED_ZONE :
            return {
                ...state,
                trackedZone : action.payload,
            };
        case PUSH_THERMAL_LOG :
            if (!Array.isArray(action.payload)) { // single log
                let logs = state.thermalLogs.slice( state.thermalLogs.length >= 100 ? 1 : 0 );
                logs.push (action.payload);
                return {
                    ...state,
                    thermalLogs : logs,
                }
            }
            else { // array of logs
                if (action.payload.length > 100) {
                    action.payload.splice(100);
                }
                let logs = state.thermalLogs.slice( (state.thermalLogs.length + action.payload.length) >= 100 ?
                                                        (state.thermalLogs.length + action.payload.length - 100) : 0 );
                logs = [...logs, ...action.payload];
                return {
                    ...state,
                    thermalLogs : logs,
                }
            }
        default :
            return state;
    }
}

export default reducer;