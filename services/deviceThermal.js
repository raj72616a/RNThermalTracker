import AndroidShell from 'react-native-android-shell';

function ShellCmd (cmd) { // promisify AndroidShell
  return new Promise((resolve) => {
      try {
          AndroidShell.executeCommand(cmd, (res)=>{
              resolve(res);
          })
      }
      catch (e) {
          console.log('services/ambientThermal - AndroidShell error');
          console.log(e);
          resolve('');
      }
  })
}

class DeviceThermalService {
    constructor() {
        this.thermalZone = undefined;
        this.thermalUri = undefined;
        this.initialization = this.init();
    }

    async init() {
        // check multiple locations for CPU thermal sensor path
        let result = await this.fetchCpuTempUri('/sys/class/thermal');
        if (result == null) {
            result = await this.fetchCpuTempUri('/sys/devices/virtual/thermal');
        }

        if (result) {
            this.thermalZone = result[0];
            this.thermalUri = result[1];
        }
    }

    async fetchCpuTempUri (base_dir) {
      const result = await ShellCmd(`ls ${base_dir}`);
      const devices = result.split('\n');

      for (let i in devices) {
          const dev = devices[i];
          if (dev.length > 9 && dev.substr(0,9) == 'thermal_z') {
              const type = await ShellCmd(`cat ${base_dir}/${dev}/type`);
              if (type.length >= 3 && type.substr(0,3) == 'cpu') {
                  return [type, `${base_dir}/${dev}/temp`];
              }
          }
      }

      return null;
    }

    async fetchZoneName () {
        await this.initialization;
        return this.thermalZone;
    }

    async fetchTemperature () {
        await this.initialization;
        if (this.thermalUri)
            return await ShellCmd(`cat ${this.thermalUri}`);

        return null;
    }
}

export default new DeviceThermalService();