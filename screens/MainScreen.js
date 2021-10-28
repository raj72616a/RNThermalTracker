import React from 'react';

import TrackerHeader from '../containers/TrackerHeader';
import TrackerChart from '../containers/TrackerChart';

import {
  View,
} from 'react-native';

export default function MainScreen (prop) {

    return (
        <View style={{ flex: 1 }}>
            <TrackerHeader/>
            <TrackerChart/>
        </View>
    )
}