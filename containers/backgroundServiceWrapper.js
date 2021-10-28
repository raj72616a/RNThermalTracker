import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { pushThermalRecords } from '../redux/actions';

import BackgroundRecording from "../services/backgroundRecording";

import useInterval from 'react-useinterval';

import {
  View,
  AppState,
} from 'react-native';

function BackgroundServiceWrapper ({pushThermalRecords, children}) {

    const appState = useRef(AppState.currentState);

    useEffect( () => {
        // init background service to save temperature record to async storage
        BackgroundRecording.init();

        // consume background fetched records on resume active
        const subscription = AppState.addEventListener("change", nextAppState => {
          if (nextAppState === "active") {
            consumeBackgroundRecords();
          }
        });

        // remove App State subscription on unmount
        return () => {
          subscription.remove();
        };
    },[])

    useInterval( ()=> {
        // infrequently check for background fetched records, in case user stay on app screen for extended period of time such that there is not suspend(background)/resume(active) event from AppState
        consumeBackgroundRecords();
    }, 1000 * 60)

    const consumeBackgroundRecords = async () => { // consume temperature records saved by background fetch
        const backgroundRecords = await BackgroundRecording.retrieve();
        if (backgroundRecords.records.length > 0) {
            pushThermalRecords(backgroundRecords.records);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            { children }
        </View>
    )
}

const mapStateToProps = function(state) {
  return {
  }
}

export default connect(mapStateToProps, {pushThermalRecords})(BackgroundServiceWrapper);