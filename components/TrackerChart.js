import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
//import { setTrackedZone } from '../redux/actions';
import { ECharts } from "react-native-echarts-wrapper";

import {
  Text,
  View,
} from 'react-native';

function TrackerChart ({thermalLogs}) {

  const chart = useRef(null);

    useEffect( () => {
        if (chart) {
            chart.current.setOption({
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
                    data: thermalLogs.filter(itm => (itm.dev!=null)).map(({timestamp, dev})=>[timestamp,dev*0.001])
                  },
                  {
                    name : 'Ambient',
                    type: 'line',
                    smooth: 0.6,
                    showSymbol: false,
                    lineStyle: {
                      width: 3,
                    },
                    data: thermalLogs.filter(itm => (itm.amb!=null)).map(({timestamp, amb})=>[timestamp,amb])
                  }
                ]
            })
        }
    },[thermalLogs])

    return (
        <View style={{ height:'80%', width:'100%' }}>

            <ECharts
              ref={chart}
              option={{
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
                            data: thermalLogs.filter(itm => (itm.dev!=null)).map(({timestamp, dev})=>[timestamp,dev])
                          },
                          {
                            name : 'Ambient',
                            type: 'line',
                            smooth: 0.6,
                            showSymbol: false,
                            lineStyle: {
                              width: 3,
                            },
                            data: thermalLogs.filter(itm => (itm.amb!=null)).map(({timestamp, amb})=>[timestamp,amb])
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