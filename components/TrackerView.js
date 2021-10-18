import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone } from '../redux/actions';

import {
  Text,
  View,
} from 'react-native';

function TrackerView ({trackedZone, setTrackedZone}) {

    useEffect( () => {
        setTrackedZone('cpu-0')
    },[])

    return (
        <View >
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Tracked Zone: { trackedZone }</Text>
            <Text style={{margin: 5, fontSize:16, fontWeight:'bold'}}>Current Temperature: { 0 }</Text>
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
    trackedZone: state.trackedZone,
  }
}

export default connect(mapStateToProps, {setTrackedZone})(TrackerView);