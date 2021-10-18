import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone, pushThermalLog } from '../redux/actions';
import DeviceThermal from '../services/deviceThermal';
import useInterval from 'react-useinterval';

import AmbientThermal from '../services/ambientThermal';

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

//        AmbientThermal.fetchTemperature().then(tmp => {
//            console.log(tmp)
//        })
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

    useInterval( ()=> {
        fetchAndPushThermalLogs ();
    }, 1000 * 20)

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