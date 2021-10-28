import React, { useEffect, useRef } from 'react';
import { ECharts } from "react-native-echarts-wrapper";
import { View } from 'react-native';

export default function DynamicEChart ({ graphData, generateOptions }) {

    const chart = useRef(null);

    useEffect( () => {
        if (chart) {
            chart.current.setOption(generateOptions(graphData)) // required to dynamically update ECharts (in webview) on prop change
        }
    },[graphData])

    return (
        <View style={{ flex: 1, padding: 10, width:'100%' }}>
            <ECharts
              ref={chart}
              option={generateOptions(graphData)}
            />
        </View>
    )
}