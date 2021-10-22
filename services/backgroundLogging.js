import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceThermal from './deviceThermal';
import AmbientThermal from './ambientThermal';

function BackgroundLoggingInit () {
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
}

export default {
    init : BackgroundLoggingInit,
}