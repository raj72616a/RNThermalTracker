import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setTrackedZone, pushThermalLog } from '../redux/actions';

import DeviceThermal from '../services/deviceThermal';

import BackgroundLogging from "../services/backgroundLogging";

import useInterval from 'react-useinterval';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrackerHeader from '../components/TrackerHeader';
import TrackerChart from '../components/TrackerChart';

import {
  Text,
  View,
  AppState,
} from 'react-native';

function MainScreen ({setTrackedZone, pushThermalLog}) {

    const appState = useRef(AppState.currentState);

    useEffect( () => {
        // check thermal zone name for CPU temperature
        DeviceThermal.fetchZoneName().then(zone => {
            if (zone)
                setTrackedZone(zone);
        })

        // init background service to save temperature record to async storage
        BackgroundLogging.init();

        // consume background fetched logs on resume active
        const subscription = AppState.addEventListener("change", nextAppState => {
          if (nextAppState === "active") {
            appendBackgroundLogs();
          }
        });

        // remove App State subscription on unmount
        return () => {
          subscription.remove();
        };
    },[])

    useInterval( ()=> {
        // infrequently check for background fetched logs, in case user stay on app screen for extended period of time such that there is not suspend(background)/resume(active) event from AppState
        appendBackgroundLogs();
    }, 1000 * 60)

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

    return (
        <View style={{ flex: 1 }}>
            <TrackerHeader/>
            <TrackerChart/>
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
     // no state to map to MainScreen
  }
}

export default connect(mapStateToProps, {setTrackedZone, pushThermalLog})(MainScreen);