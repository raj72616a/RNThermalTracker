import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceThermal from './deviceThermal';
import AmbientThermal from './ambientThermal';

function BackgroundRecordingInit () {
        // background service to save temperature record to async storage
    try {
        BackgroundFetch.configure({
            requiredNetworkType : BackgroundFetch.NETWORK_TYPE_ANY,
            minimumFetchInterval : 30,
            enableHeadless : true,
            startOnBoot : true,
            stopOnTerminate : false,
        }, async (taskId)=>{ // onEvent
            const devTmp = await DeviceThermal.fetchTemperature();
            const ambTmp = await AmbientThermal.fetchTemperature();

            try {
                let backgroundRecords = await AsyncStorage.getItem('backgroundRecords');
                backgroundRecords = backgroundRecords ? JSON.parse(backgroundRecords) : { records:[] };
                backgroundRecords.records.push({
                    timestamp : new Date(),
                    dev : devTmp,
                    amb : ambTmp,
                });
                await AsyncStorage.setItem('backgroundRecords',JSON.stringify(backgroundRecords));
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
    catch (e) {
        console.log('services/backgroundRecording - BackgroundFetch error');
        console.log(e);
    }
}

async function RetrieveBackgroundRecords () {
    try {
        const backgroundRecords = await AsyncStorage.getItem('backgroundRecords');
        await AsyncStorage.setItem('backgroundRecords',JSON.stringify({ records:[] }));

        return backgroundRecords ? JSON.parse(backgroundRecords) : { records:[] };
    }
    catch (e) {
        console.log('services/backgroundRecording : AsyncStorage failed');
        console.log(e);

        return { records:[] };
    }
}

export default {
    init : BackgroundRecordingInit,
    retrieve: RetrieveBackgroundRecords,
}