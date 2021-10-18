import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone, pushThermalLog } from '../redux/actions';

import DeviceThermal from '../services/deviceThermal';
import AmbientThermal from '../services/ambientThermal';

import useInterval from 'react-useinterval';
import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Text,
  View,
  AppState,
} from 'react-native';

const TempRender = (tmp) => {
    if (tmp == null || tmp == 0 || isNaN(tmp) ) return '--';
    return (tmp * 0.001).toFixed(1) + '°C';
}

function TrackerView ({trackedZone, setTrackedZone, pushThermalLog}) {

    const appState = useRef(AppState.currentState);
    const [temp, setTemp] = useState(0);

    const appendBackgroundLogs = async () => { // consume temperature logs saved by background fetch
            try {
                let backgroundLogs = await AsyncStorage.getItem('backgroundLogs');
                console.log(backgroundLogs);
                backgroundLogs = backgroundLogs ? JSON.parse(backgroundLogs) : { logs:[] };
                if (backgroundLogs.logs.length > 0) {
                    pushThermalLog(backgroundLogs.logs);
                }
                AsyncStorage.setItem('backgroundLogs',JSON.stringify({ logs:[] }));
            }
            catch (e) {
                console.log('components/TrackerView : consume async storage failed');
                console.log(e);
            }
    }

    useEffect( () => {
        DeviceThermal.fetchZoneName().then(zone => {
            if (zone)
                setTrackedZone(zone);
        })

        // consume background fetched logs on start and on resume active
        appendBackgroundLogs();
        const subscription = AppState.addEventListener("change", nextAppState => {
          if (nextAppState === "active") {
            appendBackgroundLogs();
          }
        });

        return () => {
          subscription.remove();
        };
    },[])

    useEffect(()=>{
        // background service to save temperature record to async storage
        BackgroundFetch.configure({
            requiredNetworkType : BackgroundFetch.NETWORK_TYPE_ANY,
            minimumFetchInterval : 30,
            enableHeadless : true,
            startOnBoot : true,
            stopOnTerminate : false,
        }, async (taskId)=>{ // onEvent
            let devTmp = await DeviceThermal.fetchTemperature();
            let ambTmp = await AmbientThermal.fetchTemperature();

            try {
                let backgroundLogs = await AsyncStorage.getItem('backgroundLogs');
                backgroundLogs = backgroundLogs ? JSON.parse(backgroundLogs) : { logs:[] };
                backgroundLogs.logs.push({
                    timestamp : new Date(),
                    dev : devTmp,
                    amb : ambTmp,
                });
                await AsyncStorage.setItem('backgroundLogs',JSON.stringify(backgroundLogs));
            }
            catch (e) {
                console.log('components/TrackerView : update async storage failed');
                console.log(e);
            }

            BackgroundFetch.finish(taskId);
        }, async (taskId)=>{ // onTimeout
            BackgroundFetch.finish(taskId);
        })
        .then ( status => { console.log('Background Task Status : ' + status) } ) // always return 2 in Android
    },[]);

    useInterval( ()=> {
        // real-time on-screen update of CPU temperature
        DeviceThermal.fetchTemperature().then(tmp => {
            if (tmp)
                setTemp(tmp);
        })
    }, 1000)

    useInterval( ()=> {
        // infrequently check for background fetched logs, in case user stay on app screen for extended period of time such that there is not suspend(background)/resume(active) event from AppState
        appendBackgroundLogs();
    }, 1000 * 60)

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