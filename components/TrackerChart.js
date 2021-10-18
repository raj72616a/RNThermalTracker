import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ECharts } from "react-native-echarts-wrapper";

import {
  Text,
  View,
} from 'react-native';

function TrackerChart ({thermalLogs}) {

  const chart = useRef(null);

  const getOptions = (stateLogs) => {
    return {
             xAxis: {
               type: 'category',
               show : false,
             },
             yAxis: {
               type: 'value',
               name: '  Temperature °C'
             },
             legend: {
               data: ['Device', 'Ambient']
             },
             series: [
               {
                 name : 'Device',
                 type: 'line',
                 smooth: 0.6,
                 showSymbol: false,
                 lineStyle: {
                   width: 3
                 },
                 data: stateLogs.filter(itm => (itm.dev!=null)).map(({timestamp, dev})=>[timestamp,dev*0.001])
               },
               {
                 name : 'Ambient',
                 type: 'line',
                 smooth: 0.6,
                 showSymbol: false,
                 lineStyle: {
                   width: 3,
                 },
                 data: stateLogs.filter(itm => (itm.amb!=null)).map(({timestamp, amb})=>[timestamp,amb])
               }
             ]
         }
    }

    useEffect( () => {
        if (chart) {
            chart.current.setOption(getOptions(thermalLogs)) // required to update ECharts (in webview) on state change
        }
    },[thermalLogs])

    return (
        <View style={{ height:'80%', width:'100%' }}>
            <ECharts
              ref={chart}
              option={getOptions(thermalLogs)}
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