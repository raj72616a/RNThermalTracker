import React, { useState } from 'react';
import { connect } from 'react-redux';
import useInterval from 'react-useinterval';

import DeviceThermal from '../services/deviceThermal';
import TempRender from '../utils/temperatureRender';

import {
  Text,
  View,
} from 'react-native';

function TrackerHeader ({trackedZone}) {

    const [temp, setTemp] = useState(0);

    useInterval( ()=> {
        // real-time on-screen update of CPU temperature
        DeviceThermal.fetchTemperature().then(tmp => {
            if (tmp)
                setTemp(tmp);
        })
    }, 1000)

    return (
        <View >
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Tracked Zone: { trackedZone || '--' }</Text>
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Current Temperature: { TempRender(temp) }</Text>
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
    trackedZone: state.trackedZone,
  }
}

export default connect(mapStateToProps, {})(TrackerHeader);