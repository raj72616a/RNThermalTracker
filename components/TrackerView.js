import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone, pushThermalLog } from '../redux/actions';

import DeviceThermal from '../services/deviceThermal';
import AmbientThermal from '../services/ambientThermal';

import useInterval from 'react-useinterval';
import BackgroundFetch from "react-native-background-fetch";

import {
  Text,
  View,
} from 'react-native';

const TempRender = (tmp) => {
    if (tmp == null || tmp == 0 || isNaN(tmp) ) return '--';
    return (tmp/1000).toFixed(1) + '°C';
}

function TrackerView ({trackedZone, setTrackedZone, pushThermalLog}) {

    const [temp, setTemp] = useState(0);

    useEffect( () => {
        DeviceThermal.fetchZoneName().then(zone => {
            if (zone)
                setTrackedZone(zone);
        })
    },[])

    useInterval( ()=> {
        DeviceThermal.fetchTemperature().then(tmp => {
            if (tmp)
                setTemp(tmp);
        })
    }, 1000)

    const fetchAndPushThermalLogs = async () => {
        let devTmp = await DeviceThermal.fetchTemperature();
        let ambTmp = await AmbientThermal.fetchTemperature();

        pushThermalLog({
            timestamp : new Date(),
            dev : devTmp,
            amb : ambTmp,
        })
    }

    useEffect(()=>{
        BackgroundFetch.configure({
            requiredNetworkType : BackgroundFetch.NETWORK_TYPE_ANY,
            minimumFetchInterval: 30,
        }, async (taskId)=>{ // onEvent
            await fetchAndPushThermalLogs();
            BackgroundFetch.finish(taskId);
        }, async (taskId)=>{ // onTimeout
            BackgroundFetch.finish(taskId);
        })
        .then ( status => { console.log('Background Task Status : ' + status) } ) // always return 2 in Android
    },[]);

    return (
        <View >
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Tracked Zone: { trackedZone }</Text>
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Current Temperature: { TempRender(temp) }</Text>
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
    trackedZone: state.trackedZone,
  }
}

export default connect(mapStateToProps, {setTrackedZone, pushThermalLog})(TrackerView);