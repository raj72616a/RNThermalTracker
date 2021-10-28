import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone } from '../redux/actions';

import useInterval from 'react-useinterval';

import DeviceThermal from '../services/deviceThermal';
import TempRender from '../utils/temperatureRender';

import StatusRenderer from '../components/StatusRenderer';

function TrackerHeader ({trackedZone, setTrackedZone}) {

    const [temp, setTemp] = useState(0);

    useEffect( () => {
        // check thermal zone name for CPU temperature
        DeviceThermal.fetchZoneName().then(zone => {
            if (zone)
                setTrackedZone(zone);
        })
    },[])

    useInterval( ()=> {
        // real-time on-screen update of CPU temperature
        DeviceThermal.fetchTemperature().then(tmp => {
            if (tmp)
                setTemp(tmp);
        })
    }, 1000)

    return (
        <StatusRenderer
            statusList={[
                { label: 'Tracked Zone', value: (trackedZone || '--') },
                { label: 'Current Temperature', value: TempRender(temp) },
           ]}
        />
    )
}

const mapStateToProps = function(state) {
  return {
    trackedZone: state.trackedZone,
  }
}

export default connect(mapStateToProps, { setTrackedZone })(TrackerHeader);