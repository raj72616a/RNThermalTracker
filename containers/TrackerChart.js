import React from 'react';
import { connect } from 'react-redux';
import DynamicEChart from '../components/dynamicEChart';

function TrackerChart ({thermalRecords}) {

    return (
        <DynamicEChart
            graphData={ thermalRecords }
            generateOptions={
                (stateRecords) => {
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
                                 data: stateRecords.filter(itm => (itm.dev!=null)).map(({timestamp, dev})=>[timestamp,dev*0.001]).sort((a,b)=> a[0].localeCompare(b[0]) )
                               },
                               {
                                 name : 'Ambient',
                                 type: 'line',
                                 smooth: 0.6,
                                 showSymbol: false,
                                 lineStyle: {
                                   width: 3,
                                 },
                                 data: stateRecords.filter(itm => (itm.amb!=null)).map(({timestamp, amb})=>[timestamp,amb]).sort((a,b)=> a[0].localeCompare(b[0]) )
                               }
                             ]
                         }
                    }
            }
        />
    )
}

const mapStateToProps = function(state) {
  return {
    thermalRecords: state.thermalRecords,
  }
}

export default connect(mapStateToProps, {})(TrackerChart);