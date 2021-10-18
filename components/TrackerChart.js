import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//import { setTrackedZone } from '../redux/actions';
import { ECharts } from "react-native-echarts-wrapper";

import {
  Text,
  View,
} from 'react-native';

function TrackerChart ({thermalLogs}) {

    useEffect( () => {
    },[])

    return (
        <View style={{ height:'80%', width:'100%' }}>

            <ECharts
              option={{
                  xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: [150, 230, 224, 218, 135, 147, 260],
                      type: 'line'
                    }
                  ]
              }}
            />
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
    thermalLogs: state.thermalLogs,
  }
}

export default connect(mapStateToProps, {})(TrackerChart);