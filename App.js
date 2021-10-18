/**
 * Thermal Tracker (React Native - Android)
 * https://github.com/raj72616a/RNThermalTracker
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { Provider } from 'react-redux'
import { createStore } from 'redux';
import reducer from './redux/reducers'

import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrackerView from './components/TrackerView';
import TrackerChart from './components/TrackerChart';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer);
let persistor = persistStore(store);

const App: () => Node = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  return (
  <Provider store = {store}>
    <PersistGate loading={null} persistor={persistor}>
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={ 'light-content' } />
      <View
        style={backgroundStyle}>
        <Text style={{fontSize:24, padding: 10, fontWeight:'bold'}}>RN Thermal Tracker</Text>
        <View
          style={{
            backgroundColor: Colors.white,
            flexDirection: "column",
          }}>
          <TrackerView/>
          <TrackerChart/>
        </View>
      </View>
    </SafeAreaView>
    </PersistGate>
  </Provider>
  );
};

export default App;
