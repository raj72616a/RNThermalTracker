import AndroidShell from 'react-native-android-shell';

let thermalZone = '';
let thermalUri = null;

  const ShellCmd = (cmd) => {
    return new Promise((resolve) => {
        AndroidShell.executeCommand(cmd, (res)=>{
            resolve(res);
        })
    })
  }

const fetchCpuTempUri = async(base_dir) => {
      let result = await ShellCmd(`ls ${base_dir}`);
      let devices = result.split('\n');

      for (let i in devices) {
          let dev = devices[i];
          if (dev.length > 9 && dev.substr(0,9) == 'thermal_z') {
              let type = await ShellCmd(`cat ${base_dir}/${dev}/type`);
              if (type.length > 3 && type.substr(0,3) == 'cpu') {
                  thermalZone = type;
                  return `${base_dir}/${dev}/temp`;
              }
          }
      }

      return null;
};

const initThermalCheck = async () => {
    thermalUri = await fetchCpuTempUri('/sys/class/thermal');
    if (!thermalUri)
        thermalUri = await fetchCpuTempUri('/sys/devices/virtual/thermal');
    // potentially add further possible directories if some phone models use path outside of these two
    return (!thermalUri);
}

const fetchTemperature = async () => {
    if (thermalUri || await initThermalCheck()) {
        return await ShellCmd(`cat ${thermalUri}`);
    }
    return null;
}

const fetchZoneName = async () => {
    if (thermalUri || await initThermalCheck()) {
        return thermalZone;
    }
    return null;
}

export default {
    fetchZoneName : fetchZoneName,
    fetchTemperature : fetchTemperature,
}